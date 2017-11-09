import { Injectable } from '@angular/core';
import { Platform }   from 'ionic-angular';

import ImgCache       from 'imgcache.js';

/**
 * This service is charged of provide the methods to cache the images
 */
@Injectable()
export class ImgcacheService {

  public imgQueue: string[] = [];

  constructor(platform: Platform) {
    ImgCache.options.debug = true;
  }

  /**
   * Init imgCache library
   * @return {Promise}
   */
  public initImgCache(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (ImgCache.ready) {
        resolve();
      } else {
        ImgCache.init(() => resolve(), () => reject());
      }
    });
  }
  public getInit()
  {
   ImgCache.init();
  }
  /**
   * Cache images
   * @param src {string} - img source
   */
  public getimage(src)
  {
        // ImgCache.cacheFile(src);
    ImgCache.clearCache();


      // ImgCache.clearCache(src,
      //   (originalUrl) => {
      //     console.log(originalUrl);
      //     console.log(src);
      //   },
      //   (e) => {
      // console.log(e);
      //
      //   });    // ImgCache.init();
    // ImgCache.isCached(src, (path: string, success: boolean) => {
    //   // if not, it will be cached
    //   if (success) {

        // ImgCache.getCachedFileURL(src,
        //     (originalUrl, cacheUrl) => {
        //     },
        //     (e) => {
        //     });
    //   } else {
    //     // cache img
    //     ImgCache.cacheFile(src);
    //     // return original img URL
    //   }
    // },(error)=>{
    //   console.log("Failed to downloaded");
    // });
  }
  public cacheImg(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ImgCache.isCached(src, (path: string, success: boolean) => {
        // if not, it will be cached
        if (success) {
          ImgCache.getCachedFileURL(src,
            (originalUrl, cacheUrl) => {
              resolve(cacheUrl);
            },
            (e) => {
              console.log("Failed to downloaded with error 1" +e);

              reject(e)
            });
        } else {
          // cache img
          ImgCache.cacheFile(src);
          // return original img URL
          resolve(src);
        }
      },(error)=>{
        console.log("Failed to downloaded with error"+error);
      });
    });
  }
}
