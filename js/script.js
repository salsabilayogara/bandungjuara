// Inisialisasi peta
const map = L.map('map').setView([-6.903, 107.6510], 13);

// Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Basemap Google Maps
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Basemap Google Satellite
const baseMapSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Satellite by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Tambahkan salah satu basemap secara default
basemapOSM.addTo(map);

// Tombol "Home"
const homeControl = L.control({ position: 'topleft' });
homeControl.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = '🏠';
  div.style.backgroundColor = 'white';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.lineHeight = '30px';
  div.style.textAlign = 'center';
  div.style.cursor = 'pointer';
  div.title = 'Kembali ke Home';
  div.onclick = function() {
    map.setView([home.lat, home.lng], home.zoom);
  };
  return div;
};
homeControl.addTo(map);

// Fitur "My Location"
L.control.locate({
  position: 'topleft',
  flyTo: true,
  strings: {
    title: "Temukan Lokasi Saya"
  },
  locateOptions: {
    enableHighAccuracy: true
  }
}).addTo(map);

//Simbologi Jembatan 
var symbologyPoint = {
    radius: 5,
    fillColor: "#9dfc03",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
    }

//Menambahkan GeoJSON Jembatan 
const jembatanPT = new L.LayerGroup();
$.getJSON("./asset/data-spasial/jembatan_pt.geojson", function (OBJECTID) {
L.geoJSON(OBJECTID, {
pointToLayer: function (feature, latlng) {
return L.circleMarker(latlng, symbologyPoint);}
}).addTo(jembatanPT);
});
jembatanPT.addTo(map);

//Menambhakan Batas Administrasi
const adminKelurahanAR = new L.LayerGroup();
$.getJSON("./asset/data-spasial/admin_kelurahan_ln.geojson", function (OBJECTID) {
L.geoJSON(OBJECTID, {
style: {
color : "black",
weight : 2,
opacity : 1,
dashArray: '3,3,20,3,20,3,20,3,20,3,20',
lineJoin: 'round'
}
}).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);

//Menambahkan GeoJSON Landuse 
const landcover = new L.LayerGroup();
$.getJSON("./asset/data-spasial/landcover_ar.geojson", function (data) {
    L.geoJSON(data, {
        style: function(feature) {
            switch (feature.properties.REMARK) {
                case 'Danau/Situ': 
                case 'Empang': 
                case 'Sungai':
                    return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB"};
                case 'Hutan Rimba': 
                    return {fillColor:"#38A800", fillOpacity: 0.8, color: "#38A800"};
                case 'Perkebunan/Kebun': 
                    return {fillColor:"#E9FFBE", fillOpacity: 0.8, color: "#E9FFBE"};
                case 'Permukiman dan Tempat Kegiatan': 
                    return {fillColor:"#FFBEBE", fillOpacity: 0.8, weight: 0.5, color: "#FB0101"};
                case 'Sawah': 
                    return {fillColor:"#01FBBB", fillOpacity: 0.8, weight: 0.5, color: "#4065EB"};
                case 'Semak Belukar': 
                    return {fillColor:"#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#00A52F"};
                case 'Tanah Kosong/Gundul': 
                    return {fillColor:"#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#000000"};
                case 'Tegalan/Ladang': 
                    return {fillColor:"#EDFF85", fillOpacity: 0.8, color: "#EDFF85"};
                case 'Vegetasi Non Budidaya Lainnya': 
                    return {fillColor:"#000000", fillOpacity: 0.8, weight: 0.5, color: "#000000"};
                default:
                    return {fillColor: "#FFFFFF", fillOpacity: 0.5, weight: 0.5, color: "#000000"};
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Tutupan Lahan: </b>' + feature.properties.REMARK);
        }
    }).addTo(landcover);
});
landcover.addTo(map);

//Menambahkan Grup Untuk Basemap
const basemaps = {
    "OpenStreetMap": basemapOSM,
    "Google Maps": baseMapGoogle,
    "Google Satellite": baseMapSatellite
    };

//Membuat Grup Untuk Data
const overlaymaps = {
    "Jembatan" : jembatanPT,
    "Batas Administrasi" : adminKelurahanAR,
    "Tutupan Lahan": landcover
    };

//Menggabungkan 
L.control.layers(basemaps,overlaymaps).addTo(map); 

//Menambahkan Komponen Legenda
// Legenda
let legend = L.control({ position: "topright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.style.backgroundColor = "white";
    div.style.padding = "10px";
    div.style.border = "2px solid #ccc";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.lineHeight = "1.4";
    div.style.minWidth = "150px";

    div.innerHTML =
        // Judul Legenda
        '<p style="font-size: 18px; font-weight: bold; margin-bottom: 10px; margin-top: 0;">Legenda</p>' +

  // Infrastruktur
  '<p style="font-size: 14px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Infrastruktur</p>' +
  '<div style="display: flex; align-items: center; margin-bottom: 5px;">' +
      '<svg width="30" height="20" style="flex-shrink:0;">' +
          '<circle cx="15" cy="10" r="6" fill="#9dfc03" stroke="black" stroke-width="1"/>' +
      '</svg>' +
      '<span style="margin-left: 8px;">Jembatan</span>' +
  '</div>' +

  // Batas Administrasi
  '<p style="font-size: 14px; font-weight: bold; margin-bottom: 5px; margin-top: 15px;">Batas Administrasi</p>' +
  '<div style="display: flex; align-items: center; margin-bottom: 5px;">' +
      '<svg width="30" height="20" style="flex-shrink:0;">' +
          '<line x1="0" y1="10" x2="30" y2="10" stroke="black" stroke-width="2" stroke-dasharray="10 1 1 1 1 1 1 1 1 1"/>' +
      '</svg>' +
      '<span style="margin-left: 8px;">Batas Desa/Kelurahan</span>' +
  '</div>' +

  // Tutupan Lahan
  '<p style="font-size: 14px; font-weight: bold; margin-bottom: 5px; margin-top: 15px;">Tutupan Lahan</p>' +

// Fungsi untuk membuat kotak warna dengan label
createColorBox("#97DBF2", "Danau/Situ") +
createColorBox("#97DBF2", "Empang") +
createColorBox("#38A800", "Hutan Rimba") +
createColorBox("#E9FFBE", "Perkebunan/Kebun") +
createColorBox("#FFBEBE", "Permukiman dan Tempat Kegiatan") +
createColorBox("#01FBBB", "Sawah") +
createColorBox("#FDFDFD", "Semak Belukar") +
createColorBox("#97DBF2", "Sungai") +
createColorBox("#FDFDFD", "Tanah Kosong/Gundul") +
createColorBox("#EDFF85", "Tegalan/Ladang") +
createColorBox("#000000", "Vegetasi Non Budidaya Lainnya");

return div;
};

// Fungsi pembantu membuat kotak warna dengan label
function createColorBox(color, label) {
return `
<div style="display: flex; align-items: center; margin-bottom: 5px;">
    <div style="width: 18px; height: 18px; background-color: ${color}; border: 1px solid #000;"></div>
    <span style="margin-left: 8px;">${label}</span>
</div>
`;
}

legend.addTo(map);