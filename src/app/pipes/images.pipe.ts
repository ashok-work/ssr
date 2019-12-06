import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imagesPipe'
})
export class ImagesPipe implements PipeTransform {

    transform(images: any[]): any {

        if (images.length > 0 && images[0]['Location']) return images[0]['Location'];

        return "assets/images/default_space.jpg";
    }
}