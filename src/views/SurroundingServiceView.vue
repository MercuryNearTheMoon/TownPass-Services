<script setup lang="ts">
import FindPlace, { type Place } from '@/components/molecules/FindPlace.vue';
import SpotList from '@/components/organisms/SpotListView.vue';
import SpotDetail from '@/components/organisms/SpotDetailView.vue';
import MessageModal from '@/components/molecules/MessageModal.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import greenDotIconUrl from '/public/images/map/youbike/mappin-green.svg';
import defaultFocusIconUrl from '/public/images/map/icon_mappin-garbagetruck-green-pressed.svg';
import { mappingFormatter, getNestedValue } from '@/utils/spot-formatter';
import { RouterLink } from 'vue-router';

export interface Spot {
  id: string;
  /** 站點名稱 */
  name: string;
  /** 行政區 */
  area: string;
  /** 地址 */
  address: string;
  /** 經度 */
  lat: number;
  /** 緯度 */
  lng: number;
  /** 距離 */
  distance?: number;
  /** 詳細資訊 */
  service_infos?: {
    title: string;
    value: { title: string; value: string }[] | string;
  }[];

  /** 其餘詳細資訊 */
  [key: string]: any;
}

const googleMapsStore = useGoogleMapsStore();

const selectedSearchData = ref<Place>({
  id: '',
  name: '',
  icon: '',
  agency: '',
  type: '',
  request_url: '',
  data_path: ''
});

/** 搜尋結果 */
const searchSpotList = ref<Spot[]>([]);
/** 視窗下搜尋結果 */
const filteredSpotList = ref<Spot[]>([]);
const selectedSpot = ref<Spot | null>(null);

/** 是否展開找地點面板 */
const isExpand = ref(false);
/** 是否點選展開列表 */
const isExpandList = ref(false);
/** 是否點選展開明細 */
const isExpandDetail = ref(false);
const isFrom = ref<'spot' | 'list' | ''>('');

let isMapReady = ref(false);

let map: any = null;
/** 使用者定位 */
let marker: any = null;
let markers: google.maps.Marker[] = [];
let markerCluster: any = null;

/**
 * 目前位置
 */
const currentLocation = ref<{ lat: number; lng: number; results: any[] }>({
  // 預設經緯度在信義區附近
  lat: 25.02337981216714,
  lng: 121.53399038508809,
  results: []
});

/**
 * 是否顯示未開啟取用位置權限通知
 */
let isShowGeoError = ref(false);

onMounted(() => {
  initMap(currentLocation.value.lat, currentLocation.value.lng);

  fetch('/mock/geocoded_addresses.json')
    .then((resp) => resp.json())
    .then((data) => {
      geo_enc.value = data;
    });
});

const handleExpandChange = (newValue: boolean) => {
  isExpand.value = newValue;
};

const handleSearchChange = async (data: Place) => {
  if (!data) {
    return;
  }
  console.log('handleSearchChange:', data);
  searchSpotList.value = [];
  selectedSearchData.value = data;

  switch (data.data_type) {
    case 'api':
    case 'json':
      searchSpotList.value = await fetchAndFormatData(
        data.request_url,
        mappingFormatter,
        data.format_fields,
        data.service_infos,
        data.data_path
      );
      break;
    case 'csv':
      break;
    default:
      break;
  }

  console.log('searchSpotList:', searchSpotList.value);
};

const setMapHeight = () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.style.height = `${window.innerHeight - 88}px`;
  }
};

/**
 * 初始化地圖
 * @param lat 緯度
 * @param lng 經度
 */
const initMap = (lat: number, lng: number) => {
  googleMapsStore.loader.load().then(async () => {
    // TODO
    // const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    // map = new Map(document.getElementById('map') as HTMLElement, {
    //   // 設定地圖的中心點經緯度位置
    //   center: { lat, lng },
    //   // 設定地圖縮放比例 0-20
    //   zoom: 13,
    //   // 限制使用者能縮放地圖的最大比例
    //   maxZoom: 20,
    //   // 限制使用者能縮放地圖的最小比例
    //   minZoom: 3,
    //   // 設定是否呈現右下角街景小人
    //   streetViewControl: false,
    //   // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
    //   mapTypeControl: false,
    //   fullscreenControl: false,
    //   zoomControl: false,
    //   // 替換成您的 MAP ID
    //   mapId: ''
    // });
    // // init marker
    // marker = new google.maps.Marker({
    //   position: {
    //     lat,
    //     lng
    //   },
    //   map,
    //   title: 'your location',
    //   icon: {
    //     path: google.maps.SymbolPath.CIRCLE,
    //     fillColor: '#4285F4',
    //     fillOpacity: 1,
    //     scale: 8, // 控制大小
    //     strokeColor: 'white',
    //     strokeWeight: 2
    //   }
    // });
    // get current location
    // getPositionClick();
    // 在地圖的dragend事件上使用該函數
    // map.addListener('dragend', function () {
    //   updateMarkers();
    // });
    // // // 在地圖的zoom_changed事件上使用該函數
    // map.addListener('zoom_changed', function () {
    //   updateMarkers();
    // });
    // isMapReady.value = true;
    // setMapHeight();
    // window.addEventListener('resize', setMapHeight);
  });
};

const getPositionClick = () => {
  googleMapsStore
    .gettingPosition()!!
    .then((position: any) => successCallback(position))
    .catch((error) => errorCallback(error));
};

const successCallback = (position: GeolocationPosition) => {
  console.log(position.coords.latitude, position.coords.longitude);

  // currentLocation.value.lat = position.coords.latitude;
  // currentLocation.value.lng = position.coords.longitude;

  // 使用者目前位置
  // marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  // map.setCenter(marker.getPosition()!);
};
const errorCallback = (error: any) => {
  console.log(error);

  if (error.code === 1) {
    // 使用者未開啟定位
    isShowGeoError.value = true;
  }
};

const fetchAndFormatData = async (
  url: string,
  formatter: (item: any, formatFields: any, serviceInfos: any[]) => Spot,
  formatFields: any,
  serviceInfos: any,
  dataPath: string
) => {
  try {
    const response = await axios.get(url);
    return formatSpotData(response.data, formatter, formatFields, serviceInfos, dataPath);
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    return [];
  }
};

const formatSpotData = (
  data: any,
  formatter: (item: any, formatFields: any, serviceInfos: any[]) => Spot,
  formatFields: any,
  serviceInfos: any,
  dataPath: string
): Spot[] => {
  // 動態解析 dataPath，如果沒有提供 dataPath，默認使用 response
  const targetData = dataPath ? getNestedValue(data, dataPath) : data;
  return targetData.map((item: any) => formatter(item, formatFields, serviceInfos));
};

const updateMarkers = async () => {
  // if (!selectedSearchData.value.id) {
  //   clearMarkers();
  //   return;
  // }
  // const bounds = map.getBounds();
  // if (!bounds) return;
  // filteredSpotList.value = searchSpotList.value
  //   .map((spot) => ({
  //     ...spot,
  //     position: new google.maps.LatLng(spot.lat, spot.lng)
  //   }))
  //   .filter((spot) => bounds.contains(spot.position))
  //   .map((spot) => ({
  //     ...spot,
  //     distance: parseFloat(
  //       (
  //         google.maps.geometry.spherical.computeDistanceBetween(
  //           new google.maps.LatLng(currentLocation.value.lat, currentLocation.value.lng),
  //           new google.maps.LatLng(spot.lat, spot.lng)
  //         ) / 1000
  //       ).toFixed(1)
  //     )
  //   }));
  // console.log('filteredSpotList:', filteredSpotList.value);
  // // Clear existing markers
  // clearMarkers();
  // let currentFocusedMarker: any = null;
  // filteredSpotList.value.forEach((spot) => {
  //   const greenDotIcon = {
  //     url: greenDotIconUrl, // 預設綠色小圓點圖標的路徑
  //     scaledSize: new google.maps.Size(20, 20), // 設置圖標的大小
  //     anchor: new google.maps.Point(10, 20) // 設置圖標的錨點，使其中心對齊底部
  //   };
  //   const marker = new google.maps.Marker({
  //     position: { lat: Number(spot.lat), lng: Number(spot.lng) },
  //     map,
  //     icon: greenDotIcon
  //   });
  //   marker.addListener('click', () => {
  //     if (currentFocusedMarker && currentFocusedMarker !== marker) {
  //       // 恢復之前聚焦的標記為預設圖標
  //       currentFocusedMarker.setIcon(greenDotIcon);
  //       selectedSpot.value = null;
  //     }
  //     const focusedIcon = {
  //       url: defaultFocusIconUrl, // 點擊後聚焦圖標的路徑
  //       scaledSize: new google.maps.Size(48, 69), // 設置圖標的大小
  //       anchor: new google.maps.Point(24, 69) // 設置圖標的錨點，使其中心對齊底部
  //     };
  //     // 設置當前標記為聚焦圖標
  //     marker.setIcon(focusedIcon);
  //     currentFocusedMarker = marker;
  //     // 獲取所選擇的 spot 的所有屬性
  //     selectedSpot.value = spot;
  //     console.log('Selected spot:', selectedSpot);
  //   });
  //   markers.push(marker);
  // });
  // // Add a marker clusterer to manage the markers.
  // markerCluster = new MarkerClusterer({
  //   markers,
  //   map,
  //   algorithm: new SuperClusterAlgorithm({ radius: 300 }), // 设置gridSize
  //   renderer: {
  //     render({ count, position }, stats) {
  //       // change color if this cluster has more markers than the mean cluster
  //       const circleRadius =
  //         count > Math.max(10, stats.clusters.markers.mean)
  //           ? count > Math.max(100, stats.clusters.markers.mean)
  //             ? '100'
  //             : '90'
  //           : '80';
  //       // create svg literal with fill color
  //       const svg =
  //         window.btoa(`<svg fill="#2eb6c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
  //         <circle fill="#2eb6c7" cx="120" cy="120" opacity=".6" r="${circleRadius}" />
  //         <circle fill="#fff" cx="120" cy="120" r="70" />
  //         <text x="50%" y="50%" style="fill:#2eb6c7" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
  //         </svg>`);
  //       // create marker using svg icon
  //       return new google.maps.Marker({
  //         position,
  //         icon: {
  //           url: `data:image/svg+xml;base64,${svg}`,
  //           scaledSize: new google.maps.Size(75, 75)
  //         },
  //         // adjust zIndex to be above other markers
  //         zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
  //       });
  //     }
  //   }
  // });
};

const clearMarkers = () => {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (markerCluster) {
    markerCluster.clearMarkers();
  }
  selectedSpot.value = null;
};

// Watch for changes in searchSpotList
watch(searchSpotList, updateMarkers);

const geo_enc = ref([]);
const nearby_hospital = computed(() => {
  console.log(geo_enc.value);
  const cur_coord = currentLocation.value;
  const coords = geo_enc.value.sort((a, b) => {
    let distA = haversineDistance(a, cur_coord);
    let distB = haversineDistance(b, cur_coord);
    return distA - distB;
  });
  return coords.slice(0, 3);
});

function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  var R = 6371; // Earth's radius in kilometers
  var dLat = toRad(coords2.lat - coords1.lat);
  var dLon = toRad(coords2.lng - coords1.lng);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c;

  return distance;
}
</script>

<template>
  <div class="py-4 bg-primary-50 min-h-screen">
    <!-- <div v-if="isShowGeoError">
      no gps
    </div>
    {{ currentLocation }} -->
    <div class="font-bold px-4 mt-4 mb-0 text-xl">周遭醫療</div>
    <div class="px-4 mb-0 text-gray-400">使用GPS自動帶入鄰近的三個醫療院所</div>
    <div v-for="hospital in nearby_hospital" class="bg-white rounded-xl shadow-lg mx-4 mt-4 p-4">
      <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.addr)}`">
        <div class="flex justify-start items-center">
          <img src="/images/primary_icon_others.svg" alt="Icon 1" class="w-10 h-10" />
          <p class="text-lg font-bold">{{ hospital.name }}</p>
        </div>
        <p class="ml-4">{{ hospital.addr }}</p>
      </a>
    </div>
  </div>

  <!-- geo modal -->
  <MessageModal :is-show="isShowGeoError">
    <template #header>
      <p>請啟用定位服務</p>
    </template>
    <template #body>
      <p class="text-grey-700">打開定位服務來允許“台北通”確認您的位置</p>
    </template>
    <template #footer>
      <button class="text-primary-500 px-7 py-2 w-full" @click="isShowGeoError = false">
        確認
      </button>
    </template>
  </MessageModal>
</template>

<style lang="postcss" scoped>
.google-map {
  width: 100%;
  height: 400px;
}

.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
}

.gps {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: rgb(255, 255, 255);
  width: 40px;
  height: 40px;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-box {
  @apply absolute flex items-center justify-between bg-white px-4 py-6 rounded-xl;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -4px 10px;
}
</style>
