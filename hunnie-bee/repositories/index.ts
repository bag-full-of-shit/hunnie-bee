import { LocalRepository } from './localRepository';
import { IRepository } from './types';

const localRepository = new LocalRepository();

export const repository: IRepository = localRepository;

export * from './types';
