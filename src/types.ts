export type Vec3 = [number, number, number];
export interface SceneState { scene: number; progress: number; scan: number; explode: number; tilt: number; city: number; morph: number; portal: number; camera: Vec3; target: Vec3; }
export interface PartDefinition { id: string; label: string; description: string; evidence: '外形研究' | '教学示意'; rest: Vec3; explode: Vec3; }
export interface EvidenceClaim { id: number; title: string; publisher: string; url: string; checked: string; kind: 'fact' | 'target' | 'assumption'; }
export type ControlMode = 'story' | 'inspect' | 'return';
export interface WorldControls { mode: ControlMode; wireframe: boolean; selected: string; preset: 'story'|'front'|'side'|'top'; reset: number; flight: number | null; reduced: boolean; costs?:number[]; }
export interface Diagnostics { state: SceneState; camera: number[]; calls: number; triangles: number; frames: number[]; renderer: string; parts: Record<string, number[]>; }
declare global { interface Window { __flight?: Diagnostics; } }
