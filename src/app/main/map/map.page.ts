import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet'
import 'leaflet.heat/dist/leaflet-heat.js'  ;
import 'leaflet.heat';
import 'leaflet-heatmap-radius'
import { WorkerService } from '../../shared/services/worker.service';
import { LocationService } from '../../shared/services/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit{

  

  constructor(private socket: WorkerService, private ls: LocationService) { }
  
  private map !: L.Map;
  private heatMap !: any;
  private tiles: any;
  private heatMapValues: any[] = [];
  private centroid: L.LatLngExpression = [51.5775, 0.1786]; //

  private initMap(): void {
    

    this.tiles =  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS'
    });

    // // create 5 random jitteries and add them to map
    // const jittery = Array(5).fill(this.centroid).map( 
    //     x => [x[0] + (Math.random() - .5)/10, x[1] + (Math.random() - .5)/10 ]
    //   ).map(
    //     x => L.marker(x as L.LatLngExpression)
    //   ).forEach(
    //     x => x.addTo(this.map)
    //   );
    this.heatMap = (L as any).heatLayer(this.heatMapValues
      , {radius: 45, scaleRadius: false})

    
    
  }

  async ngOnInit() {


    this.initMap();
    await this.onMapReady();

    
    


    

        
    this.socket.heatmapValues.subscribe(data=>{
      this.heatMapValues = data
      console.log("new heat", data)
      this.heatMap.setLatLngs(this.heatMapValues);
    });
    if(!this.socket.isConnected){
      
      await this.socket.socketConnect();
      
      
    }
    await this.socket.getHeatMapValues();

    

  }
  onMapReady() {
    setTimeout(async () => {
      
      
      this.map = L.map('map', {
        center: this.centroid,
        maxZoom: 15,
        minZoom: 15
        ,
        layers: [this.tiles, this.heatMap],
       

        })

        let coords = await this.ls.getCurrentCoords();
        this.centroid = [51.5775, 0.1786];

      this.map.invalidateSize();
      this.map.setZoom(15);
      this.map.panTo(this.centroid)
      
 }, 1000);

 
}


}
