import { LocalRepository } from './localRepository';
import { IGoalRepository } from './types';

// 현재는 로컬 저장소 사용
// 추후 Supabase 등으로 교체 시 이 파일만 수정하면 됨
export const repository: IGoalRepository = new LocalRepository();

export * from './types';
