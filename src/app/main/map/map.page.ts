import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet'
import 'leaflet.heat/dist/leaflet-heat.js';
import 'leaflet.heat';
import 'leaflet-heatmap-radius'
import { WorkerService } from '../../shared/services/worker.service';
import { LocationService } from '../../shared/services/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {


  private map !: L.Map;
  private heatMap !: any;
  private tiles: any;
  private heatMapValues: any[] = [];
  private centroid?: L.LatLngExpression; //
  private heatMapRequest: any;
  private subscriptionMade = false;


  constructor(private socket: WorkerService, private ls: LocationService) {
    
    this.initMap();
    this.onMapReady();

  }

  private initMap() {



    this.tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS'
    });
    this.heatMap = (L as any).heatLayer(this.heatMapValues
      , { radius: 45, scaleRadius: false })



  }

  ngOnInit() {







    if (!this.subscriptionMade) {
      console.log(this.heatMapRequest)
      this.heatMapRequest = this.socket.heatmapValues.subscribe(data => {
        this.heatMapValues = data
        this.heatMap.setLatLngs(this.heatMapValues);
      });
      this.subscriptionMade = true;
      this.socket.getHeatMapValues();
    }




  }
  onMapReady() {
    setTimeout(async () => {

      const location = await this.ls.getLocation().then((data)=>{
        this.centroid = [data.latitude, data.longitude];


      this.map = L.map('map', {
        center: this.centroid,
        maxZoom: 15,
        minZoom: 15
        ,
        layers: [this.tiles, this.heatMap],


      })
      // this.centroid = [51.5775, 0.1786];

      this.map.invalidateSize();
      this.map.setZoom(15);
      this.map.panTo(this.centroid)

      });
      
    }, 1000);


  }


}
