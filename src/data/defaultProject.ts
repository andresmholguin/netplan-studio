import { ProjectState } from '../types';
import projectJson from './defaultProject.json';

export const DEFAULT_PROJECT: ProjectState = projectJson as unknown as ProjectState;
