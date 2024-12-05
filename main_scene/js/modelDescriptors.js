import { color } from "three/webgpu";

const path = "/models";

const divider = 450;
const positionSol = 0.45
const gap = 1.75;

export const modelDescriptors = [
	{
		src: `${path}/Machine/BaseMachine.fbx`,
		id: "base",
		type: "fbx",
		animated: false,
		props: {
			scale: { x: 0.9 / divider, y: 0.9 / divider, z: 0.9 / divider },
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/Sol/Sol.fbx`,
		id: "sol",
		type: "fbx",
		animated: false,
		props: {
			scale: { x: 0.9 / divider, y: 0.9 / divider, z: 0.9 / divider },
			position: { x: 0, y: 0.01, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/Extensions/Extension.fbx`,
		id: "Extension",
		type: "fbx",
		animated: false,
		props: {
			scale: { x: 0.9 / divider, y: 0.9 / divider, z: 0.9 / divider },
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/Com/AnimationHead.fbx`,
		id: "blue",
		type: "fbx",
		piecePlace: 0,
		animated: true,
		offset: { x: 0, y: 0, z: 0 },
		props: {
			scale: { x: 1 / divider, y: 1 / divider, z: 1 / divider },
			position: { x: -6.10 + (0 * gap), y: positionSol, z: 0.1 },
			rotation: { x: 1.5708, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/Com/AnimationCom.fbx`,
		id: "orange",
		type: "fbx",
		piecePlace: 1,
		animated: true,
		offset: { x: 0, y: 0, z: 0 },
		props: {
			scale: { x: 1 / divider, y: 1 / divider, z: 1 / divider },
			position: { x: -6.10 + (1 * gap), y: positionSol, z: -0.4 },
			rotation: { x: 1.5708, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/Com/AnimationCom.fbx`,
		id: "red",
		type: "fbx",
		piecePlace: 2,
		animated: true,
		offset: { x: 0, y: 0, z: 0 },
		props: {
			scale: { x: 1 / divider, y: 1 / divider, z: 1 / divider },
			position: { x: -6.10 + (2 * gap), y: positionSol, z: -0.4 },
			rotation: { x: 1.5708, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/Com/AnimationCom.fbx`,
		id: "green",
		type: "fbx",
		piecePlace: 3,
		animated: true,
		offset: { x: 0, y: 0, z: 0 },
		props: {
			scale: { x: 1 / divider, y: 1 / divider, z: 1 / divider },
			position: { x: -6.10 + (3 * gap), y: positionSol, z: -0.4 },
			rotation: { x: 1.5708, y: 0, z: 0 },
		},
	},
		{
		src: `${path}/Com/AnimationCoiffe.fbx`,
		id: "black",
		type: "fbx",
		piecePlace: 4,
		animated: true,
		offset: { x: 0, y: 180, z: 0 },
		props: {
			scale: { x: 1 / divider, y: 1 / divider, z: 1 / divider },
			position: { x: -6.10 + (4 * gap), y: positionSol, z: -0.4 },
			rotation: { x: 1.5708, y: (180 * Math.PI) / 180, z: 0 },
		},
	},
	{
		src: `${path}/Com/AnimationMoteur.fbx`,
		id: "pink",
		type: "fbx",
		piecePlace: 5,
		animated: true,
		offset: { x: 0, y: 0, z: 0 },
		props: {
			scale: { x: 1 / divider, y: 1 / divider, z: 1 / divider },
			position: { x: -6.10 + (5 * gap), y: positionSol, z: -0.4 },
			rotation: { x: 1.5708, y: 0, z: 0 },
		},
	},

];
