import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export const loadModels = (models) => {
	return new Promise((resolve, reject) => {
		const promises = models.map((model) => {
			switch (model.type) {
				case "fbx":
					return loadFBX(model);
				case "gltf":
					return loadGLTF(model);
				case "obj":
					return loadOBJ(model);
				default:
					return Promise.reject(new Error("Invalid model type"));
			}
		});
		Promise.all(promises).then((models) => {
			const uniformisedModels = postProcessObjs(models);
			resolve(uniformisedModels);
		});
	});
};

function postProcessObjs(models) {
	models.forEach((model) => {
		switch (model.type) {
			case "fbx":
				model.object = model.object;
				break;
			case "gltf":
				model.object = model.object.scene;
				break;
			case "obj":
				model.obj = model.object;
				break;
			default:
				break;
		}
	});
	return models;
}

export const loadGLTF = (model) => {
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(
			model.src,
			(object) => {
				console.log("✅", model.id, "model loaded");
				resolve({ ...model, object });
			},
			(xhr) => {},
			(error) => {
				console.error("An error happened", error);
				reject(error);
			}
		);
	});
};

export const loadFBX = (model) => {
	return new Promise((resolve, reject) => {
		const loader = new FBXLoader();
		loader.load(
			model.src,
			(object) => {
				console.log("✅", model.id, "model loaded");
				resolve({ ...model, object });
			},
			(xhr) => {},
			(error) => {
				console.error("An error happened", error);
				reject(error);
			}
		);
	});
};

export const loadOBJ = (model) => {
	return new Promise((resolve, reject) => {
		const loader = new OBJLoader();
		loader.load(
			model.src,
			(object) => {
				console.log("✅", model.id, "model loaded");
				resolve({ ...model, object });
			},
			(xhr) => {},
			(error) => {
				console.error("An error happened", error);
				reject(error);
			}
		);
	});
};
