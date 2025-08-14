<template>
  <div>
    <BaseTitle class="mb-4"> {{ t('location.title') }} </BaseTitle>
    <div id="map" style="height: 700px"></div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLocationStore } from '@/stores/location/location.js';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const { t, locale } = useI18n();
const locationStore = useLocationStore();
const staffs = ref([]);
const map = ref(undefined);
const isJapanese = computed(() => locale.value === 'ja');

const fetch = async () => {
  await locationStore.fetchStaffs({ location: {} });
  staffs.value = [...locationStore.getStaffs];
  console.log(staffs.value);
  addMarkers();
};

fetch();
onMounted(() => {
  map.value = L.map('map').setView([37.7749, -122.4194], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);
  L.Marker.prototype._animateZoom = function (opt) {
    if (!this._map) {
      return;
    }
    const pos = this._map
      ._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center)
      .round();
    this._setPos(pos);
  };
});

const addMarkers = () => {
  if (!staffs.value?.length) return;
  const markers = L.markerClusterGroup({});
  const bounds = L.latLngBounds();
  staffs.value.forEach((staff) => {
    const { lat, lng } = staff?.location || {};
    if (lat && lng) {
      let popupContent = isJapanese.value ? staff.jp_name : staff.eng_name;
      if (staff.staff_image_url) {
        popupContent = `
      <div style="text-align:center;">
        <img src="${staff.staff_image_url}" alt="${isJapanese.value ? staff.jp_name : staff.eng_name}" style="width:50px;height:50px;border-radius:50%;">
        <div>${isJapanese.value ? staff.jp_name : staff.eng_name}</div>
      </div>
    `;
      }
      const marker = L.marker([lat, lng]).bindPopup(popupContent);
      marker.on('mouseover', function () {
        this.openPopup();
      });
      marker.on('mouseout', function () {
        this.closePopup();
      });
      markers?.addLayer(marker);
      bounds?.extend([lat, lng]);
    }
  });
  map.value?.addLayer(markers);
  if (map.value && bounds.isValid()) {
    map.value.fitBounds(bounds, { padding: [50, 50] });
  }
};
</script>
