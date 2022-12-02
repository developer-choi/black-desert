import type {SomeResponse} from '@type/response/some';

export default class SomeApi {
  getSomeData(): Promise<SomeResponse> {
    return new Promise<SomeResponse>(resolve => {
      resolve({data: {value: 'SOME_DATA'}});
    });
  }
}
