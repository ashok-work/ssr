import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { CommonService } from '../../../services/common-service/common.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Router } from '@angular/router';
import { AwsS3Service } from '../../../services/aws-s3/aws-s3.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent implements OnInit {
  user_image: any = false;
  max_image_size = 10; // mb
  backgroundImageStyle: any;
  constructor(public utilsService: UtilsService,
    private router: Router,
    public awsS3Service: AwsS3Service,
    private sanitizer: DomSanitizer,
    public services: CommonService) {
    this.utilsService.getUserDetails();
  }


  setAvatarImage(backgroundImage: string) {
    const style = `background-image: url(${backgroundImage})`;
    this.backgroundImageStyle = this.sanitizer.bypassSecurityTrustStyle(style);
  }

  openImageFile() {
    this.user_image = false;
    document.getElementById("photoFile").click();
  }
  fileChange(event: any) {
    const elem = event.target;
    console.log(elem.files);
    if (elem.files.length > 0) {
      for (const key in elem.files) {
        if (key !== "length" && key !== "item") {
          const file = elem.files[key];
          this.user_image = file;
          console.log("file", file.size);
          const file_size = parseFloat(file.size) / 1000 / 1000;
          if (file_size > this.max_image_size) {
            this.services.notification(
              "Maximum image size should be less than " +
              this.max_image_size +
              " MB"
            );
          } else {
            const reader = new FileReader();
            reader.onload = e => {
              this.user_image['src'] = e.target["result"];
              this.setAvatarImage(e.target["result"]);
            };
            reader.readAsDataURL(file);
            this.uploadPhoto();
          }
        }
      }
    }
  }

  async uploadPhoto() {
    try {
      if (this.user_image) {
        // this.services.presentLoading();
        const file_ext = this.user_image.name.split(".").pop();
        const file_name =
          new Date().getTime() + this.services.getUniqId() + "." + file_ext;
        const result = await this.awsS3Service.uploadFile(this.user_image, {
          file_name: file_name,
          s3_path: "spaces"
        });
        if (this.utilsService.user.user_image) this.deletePhoto();
        console.log('result', result);
        if (result) {
          const user_image = {
            'file_name': file_name,
            'Location': result.Location
          };
          this.updateProfileImage(user_image);
        }
      }
    } catch (err) {
      console.log("upload err", err);
      this.services.dismissLoading();
    }
  }

  deletePhoto() {
    this.services.presentLoading();
    this.awsS3Service
      .deleteFile(this.utilsService.user.user_image.file_name, {
        s3_path: "spaces"
      })
      .then(
        result => {
          console.log("delete file", result);
          // this.updateProfileImage(null);
        },
        err => {
          console.log("delete file", err);
          this.services.dismissLoading();
        }
      );
  }

  updateProfileImage(user_image: any) {
    const request = {
      action_url: '/user/',
      method: 'PUT',
      params: {
        user_image: user_image
      }
    };
    this.services.doHttp(request).subscribe(
      data => {
        console.log(data);
        this.services.dismissLoading();
        this.utilsService.user.user_image = user_image;
        // this.user_image = null;
        // this.utilsService.updateSpecificEvents.emit('avatar');
        this.services.notification('Details saved successfully', true);
      },
      err => {
        this.services.dismissLoading();
        console.log('Error', err);
        this.services.errorHandler(err);
      }
    );
  }


  ngOnInit() {
    this.utilsService.getUserDetails(false, true).then(data => {
      const userRef = this.utilsService.user;
      console.log(userRef.user_image);
      if (userRef && userRef.user_image && userRef.user_image.Location) {
        this.setAvatarImage(userRef.user_image.Location);
      } else {
        this.setAvatarImage('assets/images/user.png');
      }
    });
  }

}
