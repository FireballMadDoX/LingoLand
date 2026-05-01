export type LangCode = 'en' | 'es' | 'zh';

export interface ObjectTranslation { en: string; es: string; zh: string; }

export type CocoLabel =
  | 'person' | 'bicycle' | 'car' | 'motorcycle' | 'airplane' | 'bus' | 'train' | 'truck' | 'boat'
  | 'traffic light' | 'fire hydrant' | 'stop sign' | 'parking meter' | 'bench'
  | 'bird' | 'cat' | 'dog' | 'horse' | 'sheep' | 'cow' | 'elephant' | 'bear' | 'zebra' | 'giraffe'
  | 'backpack' | 'umbrella' | 'handbag' | 'tie' | 'suitcase'
  | 'frisbee' | 'skis' | 'snowboard' | 'sports ball' | 'kite'
  | 'baseball bat' | 'baseball glove' | 'skateboard' | 'surfboard' | 'tennis racket'
  | 'bottle' | 'wine glass' | 'cup' | 'fork' | 'knife' | 'spoon' | 'bowl'
  | 'banana' | 'apple' | 'sandwich' | 'orange' | 'broccoli' | 'carrot' | 'hot dog' | 'pizza' | 'donut' | 'cake'
  | 'chair' | 'couch' | 'potted plant' | 'bed' | 'dining table' | 'toilet'
  | 'tv' | 'laptop' | 'mouse' | 'remote' | 'keyboard' | 'cell phone'
  | 'microwave' | 'oven' | 'toaster' | 'sink' | 'refrigerator'
  | 'book' | 'clock' | 'vase' | 'scissors' | 'teddy bear' | 'hair drier' | 'toothbrush';

export const objectTranslations: Record<CocoLabel, ObjectTranslation> = {
  'person':         { en: 'person',        es: 'persona',           zh: '人' },
  'bicycle':        { en: 'bicycle',       es: 'bicicleta',         zh: '自行车' },
  'car':            { en: 'car',           es: 'coche',             zh: '汽车' },
  'motorcycle':     { en: 'motorcycle',    es: 'motocicleta',       zh: '摩托车' },
  'airplane':       { en: 'airplane',      es: 'avión',             zh: '飞机' },
  'bus':            { en: 'bus',           es: 'autobús',           zh: '公共汽车' },
  'train':          { en: 'train',         es: 'tren',              zh: '火车' },
  'truck':          { en: 'truck',         es: 'camión',            zh: '卡车' },
  'boat':           { en: 'boat',          es: 'barco',             zh: '船' },
  'traffic light':  { en: 'traffic light', es: 'semáforo',          zh: '红绿灯' },
  'fire hydrant':   { en: 'fire hydrant',  es: 'hidrante',          zh: '消防栓' },
  'stop sign':      { en: 'stop sign',     es: 'señal de stop',     zh: '停止标志' },
  'parking meter':  { en: 'parking meter', es: 'parquímetro',       zh: '停车计时器' },
  'bench':          { en: 'bench',         es: 'banco',             zh: '长椅' },
  'bird':           { en: 'bird',          es: 'pájaro',            zh: '鸟' },
  'cat':            { en: 'cat',           es: 'gato',              zh: '猫' },
  'dog':            { en: 'dog',           es: 'perro',             zh: '狗' },
  'horse':          { en: 'horse',         es: 'caballo',           zh: '马' },
  'sheep':          { en: 'sheep',         es: 'oveja',             zh: '羊' },
  'cow':            { en: 'cow',           es: 'vaca',              zh: '牛' },
  'elephant':       { en: 'elephant',      es: 'elefante',          zh: '大象' },
  'bear':           { en: 'bear',          es: 'oso',               zh: '熊' },
  'zebra':          { en: 'zebra',         es: 'cebra',             zh: '斑马' },
  'giraffe':        { en: 'giraffe',       es: 'jirafa',            zh: '长颈鹿' },
  'backpack':       { en: 'backpack',      es: 'mochila',           zh: '背包' },
  'umbrella':       { en: 'umbrella',      es: 'paraguas',          zh: '雨伞' },
  'handbag':        { en: 'handbag',       es: 'bolso',             zh: '手提包' },
  'tie':            { en: 'tie',           es: 'corbata',           zh: '领带' },
  'suitcase':       { en: 'suitcase',      es: 'maleta',            zh: '行李箱' },
  'frisbee':        { en: 'frisbee',       es: 'frisbee',           zh: '飞盘' },
  'skis':           { en: 'skis',          es: 'esquís',            zh: '滑雪板' },
  'snowboard':      { en: 'snowboard',     es: 'tabla de snow',     zh: '滑雪单板' },
  'sports ball':    { en: 'ball',          es: 'pelota',            zh: '球' },
  'kite':           { en: 'kite',          es: 'cometa',            zh: '风筝' },
  'baseball bat':   { en: 'baseball bat',  es: 'bate',              zh: '棒球棒' },
  'baseball glove': { en: 'baseball glove',es: 'guante de béisbol', zh: '棒球手套' },
  'skateboard':     { en: 'skateboard',    es: 'patineta',          zh: '滑板' },
  'surfboard':      { en: 'surfboard',     es: 'tabla de surf',     zh: '冲浪板' },
  'tennis racket':  { en: 'tennis racket', es: 'raqueta',           zh: '网球拍' },
  'bottle':         { en: 'bottle',        es: 'botella',           zh: '瓶子' },
  'wine glass':     { en: 'glass',         es: 'copa',              zh: '玻璃杯' },
  'cup':            { en: 'cup',           es: 'taza',              zh: '杯子' },
  'fork':           { en: 'fork',          es: 'tenedor',           zh: '叉子' },
  'knife':          { en: 'knife',         es: 'cuchillo',          zh: '刀' },
  'spoon':          { en: 'spoon',         es: 'cuchara',           zh: '勺子' },
  'bowl':           { en: 'bowl',          es: 'tazón',             zh: '碗' },
  'banana':         { en: 'banana',        es: 'plátano',           zh: '香蕉' },
  'apple':          { en: 'apple',         es: 'manzana',           zh: '苹果' },
  'sandwich':       { en: 'sandwich',      es: 'sándwich',          zh: '三明治' },
  'orange':         { en: 'orange',        es: 'naranja',           zh: '橙子' },
  'broccoli':       { en: 'broccoli',      es: 'brócoli',           zh: '西兰花' },
  'carrot':         { en: 'carrot',        es: 'zanahoria',         zh: '胡萝卜' },
  'hot dog':        { en: 'hot dog',       es: 'perrito caliente',  zh: '热狗' },
  'pizza':          { en: 'pizza',         es: 'pizza',             zh: '披萨' },
  'donut':          { en: 'donut',         es: 'donut',             zh: '甜甜圈' },
  'cake':           { en: 'cake',          es: 'pastel',            zh: '蛋糕' },
  'chair':          { en: 'chair',         es: 'silla',             zh: '椅子' },
  'couch':          { en: 'couch',         es: 'sofá',              zh: '沙发' },
  'potted plant':   { en: 'plant',         es: 'planta',            zh: '盆栽' },
  'bed':            { en: 'bed',           es: 'cama',              zh: '床' },
  'dining table':   { en: 'table',         es: 'mesa',              zh: '餐桌' },
  'toilet':         { en: 'toilet',        es: 'inodoro',           zh: '马桶' },
  'tv':             { en: 'television',    es: 'televisión',        zh: '电视' },
  'laptop':         { en: 'laptop',        es: 'portátil',          zh: '笔记本电脑' },
  'mouse':          { en: 'mouse',         es: 'ratón',             zh: '鼠标' },
  'remote':         { en: 'remote',        es: 'mando',             zh: '遥控器' },
  'keyboard':       { en: 'keyboard',      es: 'teclado',           zh: '键盘' },
  'cell phone':     { en: 'phone',         es: 'teléfono',          zh: '手机' },
  'microwave':      { en: 'microwave',     es: 'microondas',        zh: '微波炉' },
  'oven':           { en: 'oven',          es: 'horno',             zh: '烤箱' },
  'toaster':        { en: 'toaster',       es: 'tostadora',         zh: '烤面包机' },
  'sink':           { en: 'sink',          es: 'lavabo',            zh: '水槽' },
  'refrigerator':   { en: 'fridge',        es: 'nevera',            zh: '冰箱' },
  'book':           { en: 'book',          es: 'libro',             zh: '书' },
  'clock':          { en: 'clock',         es: 'reloj',             zh: '时钟' },
  'vase':           { en: 'vase',          es: 'jarrón',            zh: '花瓶' },
  'scissors':       { en: 'scissors',      es: 'tijeras',           zh: '剪刀' },
  'teddy bear':     { en: 'teddy bear',    es: 'osito',             zh: '泰迪熊' },
  'hair drier':     { en: 'hair dryer',    es: 'secador',           zh: '吹风机' },
  'toothbrush':     { en: 'toothbrush',    es: 'cepillo de dientes',zh: '牙刷' },
};

const isKnownLabel = (label: string): label is CocoLabel =>
  Object.prototype.hasOwnProperty.call(objectTranslations, label);

export function translateLabel(rawLabel: string, lang: LangCode): string {
  if (isKnownLabel(rawLabel)) return objectTranslations[rawLabel][lang];
  return rawLabel;
}

export const SPEECH_LANG_TAG: Record<LangCode, string> = {
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN',
};
