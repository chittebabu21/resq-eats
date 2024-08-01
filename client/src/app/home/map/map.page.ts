import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../interfaces/vendor';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef!: ElementRef;
  vendors!: Vendor[];
  addresses: string[] = [];
  googleMapsGeoCodingUrl = environment.googleMapsGeoCodingUrl;
  map: any;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private vendorService: VendorService
  ) { }

  ngOnInit() {
    this.getAllVendorAddresses();
  }

  ngAfterViewInit(): void {
    this.getGoogleMaps()
      .then((googleMaps) => {
        const mapEl = this.mapElementRef.nativeElement;
        this.map = new googleMaps.Map(mapEl, {
          center: { lat: 1.3521, lng: 103.8198 }, // singapore coordinates
          zoom: 16
        });

        googleMaps.event.addListenerOnce(this.map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    } 

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;

        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available...');
        }
      }
    });
  }

  getAllVendorAddresses() {
    this.vendorService.getAllVendors().subscribe({
      next: (response: any) => {
        this.vendors = response;

        if (this.vendors) {
          for (let item of this.vendors) {
            if (item.address) {
              this.getLatLng(item.address).subscribe({
                next: (response: any) => {
                  if (response.results && response.results.length > 0) {
                    const location = response.results[0].geometry.location;
                    this.addMarker(location.lat, location.lng, item.address);
                    // const infoWindow = this.map.maps.InfoWindow({
                    //   content: this.createInfoWindowContent(item)
                    // });

                    // marker.addListener('mouseover', () => {
                    //   infoWindow.open(this.map, marker);
                    // });

                    // marker.addListener('mouseout', () => {
                    //   infoWindow.close();
                    // });
                  }
                },
                error: (error) => {
                  console.log(error);
                }
              });
              this.addresses.push(item.address);
            }
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  private getLatLng(address: string) {
    const formattedAddress = address.split(' ').join('+');
    return this.http.get(this.googleMapsGeoCodingUrl + formattedAddress + '&key=' + environment.googleMapsApiKey);
  }

  private addMarker(lat: number, lng: number, title: string) {
    this.getGoogleMaps().then((googleMap) => {
      new googleMap.Marker({
        position: { lat: lat, lng: lng },
        map: this.map,
        title: title
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  private createInfoWindowContent(vendor: Vendor): string {
    if (vendor.vendor_image_url) {
      return `
        <div>
          <img src="${vendor.vendor_image_url}" alt="Vendor Image" style="width:50px;height:50px;border-radius:50%;" />
          <p>${vendor.vendor_name}</p>
        </div>
      `;
    } else {
      return `<p>${vendor.vendor_name}</p>`;
    }
  }
}
