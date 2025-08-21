<template>
  <div>
    <BaseTitle class="mb-4"> {{ t('location.title') }} </BaseTitle>
    <div id="map" style="height: 600px; border-radius: 10px"></div>
    <div class="mt-3 mb-n2">
      <BaseTextField
        v-model="search"
        :label="t('common.search')"
        color="primary"
        prepend-icon="mdi-magnify"
      >
      </BaseTextField>
    </div>
    <!-- Active -->
    <div class="d-flex flex-wrap align-items-center">
      <!-- Individuals -->
      <div class="d-flex flex-wrap align-items-center">
        <v-avatar
          v-for="staff in individualStaffs"
          :key="staff.id"
          color="primary"
          size="40"
          class="cursor-pointer border-primary border-lg ma-2"
          @click="goToStaff(staff.id)"
        >
          <v-img v-if="staff.staff_image_url" :src="staff.staff_image_url" />
          <v-img
            v-else
            class="profileImage"
            :src="profileImgPath(isJapanese ? staff.jp_name : staff.eng_name)"
          />
          <v-tooltip
            color="primary"
            activator="parent"
            location="bottom"
            transition="fade-transition"
          >
            {{ isJapanese ? staff.jp_name : staff.eng_name }}
          </v-tooltip>
        </v-avatar>
      </div>
      <!-- Groups -->
      <div
        v-for="(group, index) in groupedStaffs"
        :key="index"
        class="d-flex align-items-center bg-primary rounded-xl ma-2"
      >
        <v-avatar
          v-for="staff in group"
          :key="staff.id"
          class="cursor-pointer pa-1"
          size="40"
          @click="goToStaff(staff.id)"
        >
          <v-img v-if="staff.staff_image_url" :src="staff.staff_image_url" />
          <v-img
            v-else
            class="profileImage"
            :src="profileImgPath(isJapanese ? staff.jp_name : staff.eng_name)"
          />
          <v-tooltip
            color="primary"
            activator="parent"
            location="bottom"
            transition="fade-transition"
          >
            {{ isJapanese ? staff.jp_name : staff.eng_name }}
          </v-tooltip>
        </v-avatar>
      </div>
    </div>
    <!-- Inactive Staffs -->
    <div class="d-flex flex-wrap align-items-center">
      <v-avatar
        v-for="staff in inactiveStaffs"
        :key="staff.id"
        color="error"
        size="40"
        class="cursor-pointer border-error border-lg ma-2"
      >
        <v-img v-if="staff.staff_image_url" :src="staff.staff_image_url" />
        <v-img
          v-else
          class="profileImage"
          :src="profileImgPath(isJapanese ? staff.jp_name : staff.eng_name)"
        />
        <v-tooltip
          color="error"
          activator="parent"
          location="bottom"
          transition="fade-transition"
        >
          {{ isJapanese ? staff.jp_name : staff.eng_name }}
        </v-tooltip>
      </v-avatar>
    </div>
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
import { profileImgPath } from '@/utils/helper';

const { t, locale } = useI18n();
const locationStore = useLocationStore();
const staffs = ref([]);
const originalStaffs = ref([]);
const groupedStaffs = ref([]);
const individualStaffs = ref([]);
const inactiveStaffs = ref([]);
let map = undefined;
const search = ref('');
const isJapanese = computed(() => locale.value === 'ja');
let markers = [];
const fetch = async () => {
  await locationStore.fetchStaffs({ location: {} });
  staffs.value = [...locationStore.getStaffs];
  originalStaffs.value = [...locationStore.getStaffs];
  console.log(staffs.value);
  addMarkers();
};

fetch();
onMounted(async () => {
  map = L.map('map').setView([37.7749, -122.4194], 13);

  L.Marker.prototype._animateZoom = function (opt) {
    if (!this._map) {
      return;
    }
    const pos = this._map
      ._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center)
      .round();
    this._setPos(pos);
  };

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});

const addMarkers = async () => {
  markers = L.markerClusterGroup({});
  const bounds = L.latLngBounds();
  if (!staffs.value?.length) {
    markers.value?.forEach((marker) => map.value.removeLayer(marker));
    markers.value = [];
    return;
  }

  staffs.value.forEach((staff) => {
    const { lat, lon } = staff?.location || {};
    if (lat && lon) {
      let popupContent = isJapanese.value ? staff.jp_name : staff.eng_name;
      if (staff.staff_image_url) {
        popupContent = `
      <div style="text-align:center;">
        <img src="${staff.staff_image_url}" alt="${
          isJapanese.value ? staff.jp_name : staff.eng_name
        }" style="width:50px;height:50px;border-radius:50%;">
        <div>${isJapanese.value ? staff.jp_name : staff.eng_name}</div>
      </div>
    `;
      }
      const marker = L.marker([lat, lon], {
        staffId: staff.id,
      }).bindPopup(popupContent);
      marker.on('mouseover', function () {
        this.openPopup();
      });
      marker.on('mouseout', function () {
        this.closePopup();
      });
      markers?.addLayer(marker);
      bounds?.extend([lat, lon]);
    } else {
      inactiveStaffs.value?.push(staff);
    }
  });
  map?.addLayer(markers);
  if (map && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  markers.on('animationend', updateGroups);
  markers.on('clusterclick', updateGroups);
  markers.on('spiderfied', updateGroups);
};
const goToStaff = (staffId) => {
  const targetMarker = markers
    .getLayers()
    .find(
      (layer) => layer instanceof L.Marker && layer.options.staffId === staffId
    );
  if (!targetMarker) return;
  map.flyTo(targetMarker.getLatLng(), 16, {
    animate: true,
    duration: 1.5,
  });
  map.once('moveend', () => {
    targetMarker.openPopup();
  });
};
const updateGroups = () => {
  const groups = [];
  const individuals = [];
  markers.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      const parentCluster = markers.getVisibleParent(layer);
      if (parentCluster && parentCluster instanceof L.MarkerCluster) {
        if (parentCluster.getChildCount() > 1) {
          let group = groups.find((g) =>
            g.includes(parentCluster.getAllChildMarkers()[0].options.staffId)
          );
          if (!group) {
            group = parentCluster
              .getAllChildMarkers()
              .map((m) => m.options.staffId);
            groups.push(group);
          }
        } else {
          individuals.push(layer.options.staffId);
        }
      } else {
        individuals.push(layer.options.staffId);
      }
    }
  });
  updateAvatars(groups, individuals);
};
const updateAvatars = (groups, individuals) => {
  groupedStaffs.value = groups.map((groupIds) =>
    groupIds.map((id) => staffs.value.find((s) => s.id === id))
  );
  individualStaffs.value = individuals.map((id) =>
    staffs.value.find((s) => s.id === id)
  );
};

watch(search, (val) => {
  const searchVal = val.trim().toLowerCase();
  staffs.value = originalStaffs.value?.filter((staff) => {
    const eng = staff.eng_name?.toLowerCase() || '';
    const jp = staff.jp_name?.toLowerCase() || '';
    console.log(eng.includes(searchVal), 'eng');
    console.log(jp.includes(searchVal), 'jp');
    return eng.includes(searchVal) || jp.includes(searchVal);
  });
  console.log(staffs.value);
  addMarkers();
});
</script>

<style>
.marker-cluster-medium div {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}
.marker-cluster-medium {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
}
</style>
