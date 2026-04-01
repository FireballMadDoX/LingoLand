import type { LangCode } from "./LessonPlayer";

export type BuildSentence = {
  key: string;
  tts: string;
  ttsLang: string;
  tilesCorrect: string[];
  distractors?: string[];
};

export function getBuildSentences(lessonId: string, language: LangCode, name: string, ttsLang: string): BuildSentence[] {
  if (lessonId === "lesson-02") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "I am good.", ttsLang, tilesCorrect: ["I", "am", "good."], distractors: ["happy.", "tired.", "How", "you?"] },
        { key: "en-2", tts: "I am happy.", ttsLang, tilesCorrect: ["I", "am", "happy."], distractors: ["good.", "tired.", "How", "you?"] },
        { key: "en-3", tts: "I am tired.", ttsLang, tilesCorrect: ["I", "am", "tired."], distractors: ["good.", "happy.", "How", "you?"] },
        { key: "en-4", tts: "How are you?", ttsLang, tilesCorrect: ["How", "are", "you?"], distractors: ["I", "am", "good.", "happy."] },
        { key: "en-5", tts: "I am good.", ttsLang, tilesCorrect: ["I", "am", "good."], distractors: ["How", "are", "you?", "happy."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Estoy bien.", ttsLang, tilesCorrect: ["Estoy", "bien."], distractors: ["feliz.", "cansado.", "¿Cómo", "estás?"] },
        { key: "es-2", tts: "Estoy feliz.", ttsLang, tilesCorrect: ["Estoy", "feliz."], distractors: ["bien.", "cansado.", "¿Cómo", "estás?"] },
        { key: "es-3", tts: "Estoy cansado.", ttsLang, tilesCorrect: ["Estoy", "cansado."], distractors: ["bien.", "feliz.", "¿Cómo", "estás?"] },
        { key: "es-4", tts: "¿Cómo estás?", ttsLang, tilesCorrect: ["¿Cómo", "estás?"], distractors: ["Estoy", "bien.", "feliz.", "cansado."] },
        { key: "es-5", tts: "Estoy bien.", ttsLang, tilesCorrect: ["Estoy", "bien."], distractors: ["¿Cómo", "estás?", "feliz.", "cansado."] }
      ];
    }
    return [
      { key: "zh-1", tts: "我很好。", ttsLang, tilesCorrect: ["我", "很好。"], distractors: ["很开心。", "很累。", "你", "好吗？"] },
      { key: "zh-2", tts: "我很开心。", ttsLang, tilesCorrect: ["我", "很开心。"], distractors: ["很好。", "很累。", "你", "好吗？"] },
      { key: "zh-3", tts: "我很累。", ttsLang, tilesCorrect: ["我", "很累。"], distractors: ["很好。", "很开心。", "你", "好吗？"] },
      { key: "zh-4", tts: "你好吗？", ttsLang, tilesCorrect: ["你", "好吗？"], distractors: ["我", "很好。", "很开心。", "很累。"] },
      { key: "zh-5", tts: "我很好。", ttsLang, tilesCorrect: ["我", "很好。"], distractors: ["你", "好吗？", "很开心。", "很累。"] }
    ];
  }

  if (lessonId === "lesson-03") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "It is red.", ttsLang, tilesCorrect: ["It", "is", "red."], distractors: ["blue.", "yellow.", "green."] },
        { key: "en-2", tts: "It is blue.", ttsLang, tilesCorrect: ["It", "is", "blue."], distractors: ["red.", "yellow.", "green."] },
        { key: "en-3", tts: "It is yellow.", ttsLang, tilesCorrect: ["It", "is", "yellow."], distractors: ["red.", "blue.", "green."] },
        { key: "en-4", tts: "It is green.", ttsLang, tilesCorrect: ["It", "is", "green."], distractors: ["red.", "blue.", "yellow."] },
        { key: "en-5", tts: "It is red.", ttsLang, tilesCorrect: ["It", "is", "red."], distractors: ["blue.", "yellow.", "green."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Es rojo.", ttsLang, tilesCorrect: ["Es", "rojo."], distractors: ["azul.", "amarillo.", "verde."] },
        { key: "es-2", tts: "Es azul.", ttsLang, tilesCorrect: ["Es", "azul."], distractors: ["rojo.", "amarillo.", "verde."] },
        { key: "es-3", tts: "Es amarillo.", ttsLang, tilesCorrect: ["Es", "amarillo."], distractors: ["rojo.", "azul.", "verde."] },
        { key: "es-4", tts: "Es verde.", ttsLang, tilesCorrect: ["Es", "verde."], distractors: ["rojo.", "azul.", "amarillo."] },
        { key: "es-5", tts: "Es rojo.", ttsLang, tilesCorrect: ["Es", "rojo."], distractors: ["azul.", "amarillo.", "verde."] }
      ];
    }
    return [
      { key: "zh-1", tts: "它是红色。", ttsLang, tilesCorrect: ["它", "是", "红色。"], distractors: ["蓝色。", "黄色。", "绿色。"] },
      { key: "zh-2", tts: "它是蓝色。", ttsLang, tilesCorrect: ["它", "是", "蓝色。"], distractors: ["红色。", "黄色。", "绿色。"] },
      { key: "zh-3", tts: "它是黄色。", ttsLang, tilesCorrect: ["它", "是", "黄色。"], distractors: ["红色。", "蓝色。", "绿色。"] },
      { key: "zh-4", tts: "它是绿色。", ttsLang, tilesCorrect: ["它", "是", "绿色。"], distractors: ["红色。", "蓝色。", "黄色。"] },
      { key: "zh-5", tts: "它是红色。", ttsLang, tilesCorrect: ["它", "是", "红色。"], distractors: ["蓝色。", "黄色。", "绿色。"] }
    ];
  }

  if (lessonId === "lesson-04") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "This is my mom.", ttsLang, tilesCorrect: ["This", "is", "my", "mom."], distractors: ["dad.", "brother.", "sister."] },
        { key: "en-2", tts: "This is my dad.", ttsLang, tilesCorrect: ["This", "is", "my", "dad."], distractors: ["mom.", "brother.", "sister."] },
        { key: "en-3", tts: "This is my brother.", ttsLang, tilesCorrect: ["This", "is", "my", "brother."], distractors: ["mom.", "dad.", "sister."] },
        { key: "en-4", tts: "This is my sister.", ttsLang, tilesCorrect: ["This", "is", "my", "sister."], distractors: ["mom.", "dad.", "brother."] },
        { key: "en-5", tts: "This is my mom.", ttsLang, tilesCorrect: ["This", "is", "my", "mom."], distractors: ["dad.", "brother.", "sister."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Esta es mi mamá.", ttsLang, tilesCorrect: ["Esta", "es", "mi", "mamá."], distractors: ["papá.", "hermano.", "hermana."] },
        { key: "es-2", tts: "Este es mi papá.", ttsLang, tilesCorrect: ["Este", "es", "mi", "papá."], distractors: ["mamá.", "hermano.", "hermana."] },
        { key: "es-3", tts: "Este es mi hermano.", ttsLang, tilesCorrect: ["Este", "es", "mi", "hermano."], distractors: ["mamá.", "papá.", "hermana."] },
        { key: "es-4", tts: "Esta es mi hermana.", ttsLang, tilesCorrect: ["Esta", "es", "mi", "hermana."], distractors: ["mamá.", "papá.", "hermano."] },
        { key: "es-5", tts: "Esta es mi mamá.", ttsLang, tilesCorrect: ["Esta", "es", "mi", "mamá."], distractors: ["papá.", "hermano.", "hermana."] }
      ];
    }
    return [
      { key: "zh-1", tts: "这是我妈妈。", ttsLang, tilesCorrect: ["这", "是", "我", "妈妈。"], distractors: ["爸爸。", "哥哥。", "姐姐。"] },
      { key: "zh-2", tts: "这是我爸爸。", ttsLang, tilesCorrect: ["这", "是", "我", "爸爸。"], distractors: ["妈妈。", "哥哥。", "姐姐。"] },
      { key: "zh-3", tts: "这是我哥哥。", ttsLang, tilesCorrect: ["这", "是", "我", "哥哥。"], distractors: ["妈妈。", "爸爸。", "姐姐。"] },
      { key: "zh-4", tts: "这是我姐姐。", ttsLang, tilesCorrect: ["这", "是", "我", "姐姐。"], distractors: ["妈妈。", "爸爸。", "哥哥。"] },
      { key: "zh-5", tts: "这是我妈妈。", ttsLang, tilesCorrect: ["这", "是", "我", "妈妈。"], distractors: ["爸爸。", "哥哥。", "姐姐。"] }
    ];
  }

  if (lessonId === "lesson-05") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "I like apples.", ttsLang, tilesCorrect: ["I", "like", "apples."], distractors: ["bread.", "water.", "rice."] },
        { key: "en-2", tts: "I eat bread.", ttsLang, tilesCorrect: ["I", "eat", "bread."], distractors: ["apples.", "water.", "rice."] },
        { key: "en-3", tts: "I drink water.", ttsLang, tilesCorrect: ["I", "drink", "water."], distractors: ["apples.", "bread.", "rice."] },
        { key: "en-4", tts: "I eat rice.", ttsLang, tilesCorrect: ["I", "eat", "rice."], distractors: ["apples.", "bread.", "water."] },
        { key: "en-5", tts: "I like apples.", ttsLang, tilesCorrect: ["I", "like", "apples."], distractors: ["bread.", "water.", "rice."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Me gusta la manzana.", ttsLang, tilesCorrect: ["Me", "gusta", "la", "manzana."], distractors: ["pan.", "agua.", "arroz."] },
        { key: "es-2", tts: "Yo como pan.", ttsLang, tilesCorrect: ["Yo", "como", "pan."], distractors: ["manzana.", "agua.", "arroz."] },
        { key: "es-3", tts: "Yo bebo agua.", ttsLang, tilesCorrect: ["Yo", "bebo", "agua."], distractors: ["manzana.", "pan.", "arroz."] },
        { key: "es-4", tts: "Yo como arroz.", ttsLang, tilesCorrect: ["Yo", "como", "arroz."], distractors: ["manzana.", "pan.", "agua."] },
        { key: "es-5", tts: "Me gusta la manzana.", ttsLang, tilesCorrect: ["Me", "gusta", "la", "manzana."], distractors: ["pan.", "agua.", "arroz."] }
      ];
    }
    return [
      { key: "zh-1", tts: "我喜欢苹果。", ttsLang, tilesCorrect: ["我", "喜欢", "苹果。"], distractors: ["面包。", "水。", "米饭。"] },
      { key: "zh-2", tts: "我吃面包。", ttsLang, tilesCorrect: ["我", "吃", "面包。"], distractors: ["苹果。", "水。", "米饭。"] },
      { key: "zh-3", tts: "我喝水。", ttsLang, tilesCorrect: ["我", "喝", "水。"], distractors: ["苹果。", "面包。", "米饭。"] },
      { key: "zh-4", tts: "我吃米饭。", ttsLang, tilesCorrect: ["我", "吃", "米饭。"], distractors: ["苹果。", "面包。", "水。"] },
      { key: "zh-5", tts: "我喜欢苹果。", ttsLang, tilesCorrect: ["我", "喜欢", "苹果。"], distractors: ["面包。", "水。", "米饭。"] }
    ];
  }

  if (lessonId === "lesson-06") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "It is a dog.", ttsLang, tilesCorrect: ["It", "is", "a", "dog."], distractors: ["cat.", "bird.", "fish."] },
        { key: "en-2", tts: "It is a cat.", ttsLang, tilesCorrect: ["It", "is", "a", "cat."], distractors: ["dog.", "bird.", "fish."] },
        { key: "en-3", tts: "It is a bird.", ttsLang, tilesCorrect: ["It", "is", "a", "bird."], distractors: ["dog.", "cat.", "fish."] },
        { key: "en-4", tts: "It is a fish.", ttsLang, tilesCorrect: ["It", "is", "a", "fish."], distractors: ["dog.", "cat.", "bird."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Es un perro.", ttsLang, tilesCorrect: ["Es", "un", "perro."], distractors: ["gato.", "pájaro.", "pez."] },
        { key: "es-2", tts: "Es un gato.", ttsLang, tilesCorrect: ["Es", "un", "gato."], distractors: ["perro.", "pájaro.", "pez."] },
        { key: "es-3", tts: "Es un pájaro.", ttsLang, tilesCorrect: ["Es", "un", "pájaro."], distractors: ["perro.", "gato.", "pez."] },
        { key: "es-4", tts: "Es un pez.", ttsLang, tilesCorrect: ["Es", "un", "pez."], distractors: ["perro.", "gato.", "pájaro."] }
      ];
    }
    return [
      { key: "zh-1", tts: "它是一只狗。", ttsLang, tilesCorrect: ["它", "是", "一只", "狗。"], distractors: ["猫。", "鸟。", "鱼。"] },
      { key: "zh-2", tts: "它是一只猫。", ttsLang, tilesCorrect: ["它", "是", "一只", "猫。"], distractors: ["狗。", "鸟。", "鱼。"] },
      { key: "zh-3", tts: "它是一只鸟。", ttsLang, tilesCorrect: ["它", "是", "一只", "鸟。"], distractors: ["狗。", "猫。", "鱼。"] },
      { key: "zh-4", tts: "它是一只鱼。", ttsLang, tilesCorrect: ["它", "是", "一只", "鱼。"], distractors: ["狗。", "猫。", "鸟。"] }
    ];
  }

  if (lessonId === "lesson-07") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "I see one.", ttsLang, tilesCorrect: ["I", "see", "one."], distractors: ["two.", "three.", "four."] },
        { key: "en-2", tts: "I see two.", ttsLang, tilesCorrect: ["I", "see", "two."], distractors: ["one.", "three.", "four."] },
        { key: "en-3", tts: "I see three.", ttsLang, tilesCorrect: ["I", "see", "three."], distractors: ["one.", "two.", "four."] },
        { key: "en-4", tts: "I see four.", ttsLang, tilesCorrect: ["I", "see", "four."], distractors: ["one.", "two.", "three."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Veo uno.", ttsLang, tilesCorrect: ["Veo", "uno."], distractors: ["dos.", "tres.", "cuatro."] },
        { key: "es-2", tts: "Veo dos.", ttsLang, tilesCorrect: ["Veo", "dos."], distractors: ["uno.", "tres.", "cuatro."] },
        { key: "es-3", tts: "Veo tres.", ttsLang, tilesCorrect: ["Veo", "tres."], distractors: ["uno.", "dos.", "cuatro."] },
        { key: "es-4", tts: "Veo cuatro.", ttsLang, tilesCorrect: ["Veo", "cuatro."], distractors: ["uno.", "dos.", "tres."] }
      ];
    }
    return [
      { key: "zh-1", tts: "我看见一。", ttsLang, tilesCorrect: ["我", "看见", "一。"], distractors: ["二。", "三。", "四。"] },
      { key: "zh-2", tts: "我看见二。", ttsLang, tilesCorrect: ["我", "看见", "二。"], distractors: ["一。", "三。", "四。"] },
      { key: "zh-3", tts: "我看见三。", ttsLang, tilesCorrect: ["我", "看见", "三。"], distractors: ["一。", "二。", "四。"] },
      { key: "zh-4", tts: "我看见四。", ttsLang, tilesCorrect: ["我", "看见", "四。"], distractors: ["一。", "二。", "三。"] }
    ];
  }

  if (lessonId === "lesson-08") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "This is a book.", ttsLang, tilesCorrect: ["This", "is", "a", "book."], distractors: ["pen.", "desk.", "bag."] },
        { key: "en-2", tts: "This is a pen.", ttsLang, tilesCorrect: ["This", "is", "a", "pen."], distractors: ["book.", "desk.", "bag."] },
        { key: "en-3", tts: "This is a desk.", ttsLang, tilesCorrect: ["This", "is", "a", "desk."], distractors: ["book.", "pen.", "bag."] },
        { key: "en-4", tts: "This is a bag.", ttsLang, tilesCorrect: ["This", "is", "a", "bag."], distractors: ["book.", "pen.", "desk."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Esto es un libro.", ttsLang, tilesCorrect: ["Esto", "es", "un", "libro."], distractors: ["bolígrafo.", "escritorio.", "bolsa."] },
        { key: "es-2", tts: "Esto es un bolígrafo.", ttsLang, tilesCorrect: ["Esto", "es", "un", "bolígrafo."], distractors: ["libro.", "escritorio.", "bolsa."] },
        { key: "es-3", tts: "Esto es un escritorio.", ttsLang, tilesCorrect: ["Esto", "es", "un", "escritorio."], distractors: ["libro.", "bolígrafo.", "bolsa."] },
        { key: "es-4", tts: "Esto es una bolsa.", ttsLang, tilesCorrect: ["Esto", "es", "una", "bolsa."], distractors: ["libro.", "bolígrafo.", "escritorio."] }
      ];
    }
    return [
      { key: "zh-1", tts: "这是一本书。", ttsLang, tilesCorrect: ["这", "是", "一本", "书。"], distractors: ["笔。", "桌子。", "包。"] },
      { key: "zh-2", tts: "这是一支笔。", ttsLang, tilesCorrect: ["这", "是", "一支", "笔。"], distractors: ["书。", "桌子。", "包。"] },
      { key: "zh-3", tts: "这是一张桌子。", ttsLang, tilesCorrect: ["这", "是", "一张", "桌子。"], distractors: ["书。", "笔。", "包。"] },
      { key: "zh-4", tts: "这是一个包。", ttsLang, tilesCorrect: ["这", "是", "一个", "包。"], distractors: ["书。", "笔。", "桌子。"] }
    ];
  }

  if (lessonId === "lesson-09") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "It is sunny.", ttsLang, tilesCorrect: ["It", "is", "sunny."], distractors: ["rainy.", "cloudy.", "windy."] },
        { key: "en-2", tts: "It is rainy.", ttsLang, tilesCorrect: ["It", "is", "rainy."], distractors: ["sunny.", "cloudy.", "windy."] },
        { key: "en-3", tts: "It is cloudy.", ttsLang, tilesCorrect: ["It", "is", "cloudy."], distractors: ["sunny.", "rainy.", "windy."] },
        { key: "en-4", tts: "It is windy.", ttsLang, tilesCorrect: ["It", "is", "windy."], distractors: ["sunny.", "rainy.", "cloudy."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Está soleado.", ttsLang, tilesCorrect: ["Está", "soleado."], distractors: ["lluvioso.", "nublado.", "ventoso."] },
        { key: "es-2", tts: "Está lluvioso.", ttsLang, tilesCorrect: ["Está", "lluvioso."], distractors: ["soleado.", "nublado.", "ventoso."] },
        { key: "es-3", tts: "Está nublado.", ttsLang, tilesCorrect: ["Está", "nublado."], distractors: ["soleado.", "lluvioso.", "ventoso."] },
        { key: "es-4", tts: "Está ventoso.", ttsLang, tilesCorrect: ["Está", "ventoso."], distractors: ["soleado.", "lluvioso.", "nublado."] }
      ];
    }
    return [
      { key: "zh-1", tts: "今天是晴天。", ttsLang, tilesCorrect: ["今天", "是", "晴天。"], distractors: ["下雨。", "多云。", "刮风。"] },
      { key: "zh-2", tts: "今天下雨。", ttsLang, tilesCorrect: ["今天", "下雨。"], distractors: ["晴天。", "多云。", "刮风。"] },
      { key: "zh-3", tts: "今天多云。", ttsLang, tilesCorrect: ["今天", "多云。"], distractors: ["晴天。", "下雨。", "刮风。"] },
      { key: "zh-4", tts: "今天刮风。", ttsLang, tilesCorrect: ["今天", "刮风。"], distractors: ["晴天。", "下雨。", "多云。"] }
    ];
  }

  if (lessonId === "lesson-10") {
    if (language === "en") {
      return [
        { key: "en-1", tts: "I feel sad.", ttsLang, tilesCorrect: ["I", "feel", "sad."], distractors: ["excited.", "angry.", "calm."] },
        { key: "en-2", tts: "I feel excited.", ttsLang, tilesCorrect: ["I", "feel", "excited."], distractors: ["sad.", "angry.", "calm."] },
        { key: "en-3", tts: "I feel angry.", ttsLang, tilesCorrect: ["I", "feel", "angry."], distractors: ["sad.", "excited.", "calm."] },
        { key: "en-4", tts: "I feel calm.", ttsLang, tilesCorrect: ["I", "feel", "calm."], distractors: ["sad.", "excited.", "angry."] }
      ];
    }
    if (language === "es") {
      return [
        { key: "es-1", tts: "Me siento triste.", ttsLang, tilesCorrect: ["Me", "siento", "triste."], distractors: ["emocionado.", "enojado.", "tranquilo."] },
        { key: "es-2", tts: "Me siento emocionado.", ttsLang, tilesCorrect: ["Me", "siento", "emocionado."], distractors: ["triste.", "enojado.", "tranquilo."] },
        { key: "es-3", tts: "Me siento enojado.", ttsLang, tilesCorrect: ["Me", "siento", "enojado."], distractors: ["triste.", "emocionado.", "tranquilo."] },
        { key: "es-4", tts: "Me siento tranquilo.", ttsLang, tilesCorrect: ["Me", "siento", "tranquilo."], distractors: ["triste.", "emocionado.", "enojado."] }
      ];
    }
    return [
      { key: "zh-1", tts: "我觉得伤心。", ttsLang, tilesCorrect: ["我", "觉得", "伤心。"], distractors: ["兴奋。", "生气。", "平静。"] },
      { key: "zh-2", tts: "我觉得兴奋。", ttsLang, tilesCorrect: ["我", "觉得", "兴奋。"], distractors: ["伤心。", "生气。", "平静。"] },
      { key: "zh-3", tts: "我觉得生气。", ttsLang, tilesCorrect: ["我", "觉得", "生气。"], distractors: ["伤心。", "兴奋。", "平静。"] },
      { key: "zh-4", tts: "我觉得平静。", ttsLang, tilesCorrect: ["我", "觉得", "平静。"], distractors: ["伤心。", "兴奋。", "生气。"] }
    ];
  }

  // Final fallback (Lesson 1 logic or similar generic)
  if (language === "en") {
    return [
      { key: "en-1", tts: `My name is ${name}.`, ttsLang, tilesCorrect: ["My", "name", "is", `${name}.`], distractors: ["Hello!", "Hi!", "your", "What's", "meet", "you."] },
      { key: "en-2", tts: "Hello!", ttsLang, tilesCorrect: ["Hello!"], distractors: ["Hi!", "name", "is", "My", "your", "What's", "Hello", "you."] },
      { key: "en-3", tts: "Hi!", ttsLang, tilesCorrect: ["Hi!"], distractors: ["Hello!", "My", "name", "is", "your", "What's", "Hi", "meet"] }
    ];
  }
  if (language === "es") {
    return [
      { key: "es-1", tts: `Me llamo ${name}.`, ttsLang, tilesCorrect: ["Me", "llamo", `${name}.`], distractors: ["Hola", "Hi", "¿Cómo", "te", "llamas?", "gusto."] },
      { key: "es-2", tts: "¡Hola!", ttsLang, tilesCorrect: ["¡Hola!"], distractors: ["Hola", "Hi", "Me", "llamo", "¿Cómo", "te", "gusto", "llamas?"] },
      { key: "es-3", tts: "Hi", ttsLang, tilesCorrect: ["Hi"], distractors: ["¡Hola!", "Hola", "Me", "llamo", "¿Cómo", "te", "llamas?", "gusto."] }
    ];
  }
  return [
    { key: "zh-1", tts: `我叫 ${name}。`, ttsLang, tilesCorrect: ["我叫", `${name}。`], distractors: ["你好！", "嗨！", "你", "叫什么", "名字？", "很高兴", "认识"] },
    { key: "zh-2", tts: "你好！", ttsLang, tilesCorrect: ["你好！"], distractors: ["嗨！", "我叫", "你", "名字？", "叫什么", "很高兴", "认识", "你。"] },
    { key: "zh-3", tts: "嗨！", ttsLang, tilesCorrect: ["嗨！"], distractors: ["你好！", "我叫", "你", "叫什么", "名字？", "很高兴", "认识", "你。"] }
  ];
}
