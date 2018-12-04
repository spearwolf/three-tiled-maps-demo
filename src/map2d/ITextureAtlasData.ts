import { ITextureAtlasFrameData } from './ITextureAtlasFrameData';
import { ITextureAtlasMetaData } from './ITextureAtlasMetaData';

export interface ITextureAtlasData {
  frames: {
    [name: string]: ITextureAtlasFrameData;
  };
  meta: ITextureAtlasMetaData;
}
