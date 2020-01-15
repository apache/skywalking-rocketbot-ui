export interface CssMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface CssTranslate {
  x: number;
  y: number;
}

class CssHelper {
  public matrixSerialization(matrixString: string): CssMatrix {
    const matrixArray = matrixString
      .replace('matrix(', '')
      .replace(')', '')
      .split(',');
    // const matrixNumberArray = [];
    const matrixNumberArray = matrixArray.map((value) => {
      return parseFloat(value);
    });
    return {
      a: matrixNumberArray[0],
      b: matrixNumberArray[1],
      c: matrixNumberArray[2],
      d: matrixNumberArray[3],
      tx: matrixNumberArray[4],
      ty: matrixNumberArray[5],
    };
  }

  public translateDeserialization(translate: CssTranslate) {
    let translateString = '';
    const translateEntries = Object.entries(translate);
    translateEntries.forEach((value) => {
      translateString += value[1] + ',';
    });
    translateString = translateString.slice(0, translateString.length - 1);
    return `translate(${translateString})`;
  }

  public translateSerialization(translateString: string): CssTranslate {
    const translateArray = translateString
      .replace('translate(', '')
      .replace(')', '')
      .split(',');
    // const translateNumberArray = [];
    const translateNumberArray = translateArray.map((value) => {
      return parseFloat(value);
    });
    return {
      x: translateNumberArray[0],
      y: translateNumberArray[1],
    };
  }

  public matrixDeserialization(cssMatrix: CssMatrix) {
    let matrixString = '';
    const matrixEntries = Object.entries(cssMatrix);
    matrixEntries.forEach((value) => {
      matrixString += value[1] + ',';
    });
    matrixString = matrixString.slice(0, matrixString.length - 1);
    return `matrix(${matrixString})`;
  }
}

export default new CssHelper();
