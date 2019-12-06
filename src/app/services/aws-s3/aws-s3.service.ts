import { Injectable } from "@angular/core";
// import * as AWS from 'aws-sdk/global';
import * as S3 from "aws-sdk/clients/s3";
import { environment } from "../../../environments/environment";
import { IAWSParams } from "src/app/interfaces/spaces";

// declare let AWS: any;

@Injectable()
export class AwsS3Service {
  constructor() { }

  public getS3Bucket(): any {
    // console.log('file', file);
    const bucket = new S3({
      accessKeyId: environment.s3Bucket.accessKeyId,
      secretAccessKey: environment.s3Bucket.secretAccessKey,
      region: environment.s3Bucket.region
    });
    return bucket;
  }

  uploadFile(file: Blob, params?: IAWSParams): Promise<any> {
    console.log(file);
    let bucket_name = environment.s3Bucket.Bucket;
    let file_name = file['name'];
    let s3_path = "";
    if (params) {
      if (params.hasOwnProperty("file_name")) {
        file_name = params["file_name"];
      }
      if (params.hasOwnProperty("s3_path")) {
        s3_path = params["s3_path"] + "/";
      }
    }
    const bucket_params = {
      Bucket: bucket_name,
      Key: s3_path + file_name,
      Body: file,
      ACL: "public-read-write",
      ContentType: file.type
    };
    return this.getS3Bucket()
      .upload(bucket_params)
      .promise();
  }

  deleteFile(file: File, params?: IAWSParams): Promise<any> {
    let bucket_name = environment.s3Bucket.Bucket;
    let file_name = file;
    let s3_path = "";
    if (params) {
      if (params.hasOwnProperty("s3_path")) {
        s3_path = params["s3_path"] + "/";
      }
    }
    const bucket_params = {
      Bucket: bucket_name,
      Key: s3_path + file_name
    };
    return this.getS3Bucket()
      .deleteObject(bucket_params)
      .promise();
  }
}
