import IMatch from './IMatch';

export default interface IMatcheModel {
  findAll(): Promise<IMatch[]>
  findAllInProgress(data: boolean): Promise<IMatch[]>;
  updateMatch(id: number, data: object): void,
  finishedMatch(id: number): void;
  createMatch(data: IMatch): Promise<IMatch>
}
