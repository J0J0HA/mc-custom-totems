async function generateZIP(users) {
	const zipFileWriter = new zip.BlobWriter();
	const zipWriter = new zip.ZipWriter(zipFileWriter);

	let index = 0;
	for (const user of users) {
		const textReader = new zip.TextReader(
			JSON.stringify({
				parent: "minecraft:item/generated",
				textures: {
					layer0: `customtotems:item/totem${index}`,
				},
			}),
		);
		await zipWriter.add(
			`assets/customtotems/models/item/totem${index}.json`,
			textReader,
		);

		const png = await fetch(
			`https://skinmc.net/api/v1/renders/skins/${user}/totem`,
		);
		const pngBlob = await png.blob();
		const pngReader = new zip.BlobReader(pngBlob);
		await zipWriter.add(
			`assets/customtotems/textures/item/totem${index}.png`,
			pngReader,
		);
		index++;
	}

	const textReader = new zip.TextReader(
		JSON.stringify({
			model: {
				type: "minecraft:select",
				property: "minecraft:custom_model_data",
				cases: users.map((user, index) => ({
					when: user,
					model: {
						type: "minecraft:model",
						model: `customtotems:item/totem${index}`,
					},
				})),
				fallback: {
					type: "minecraft:model",
					model: "minecraft:item/totem_of_undying",
				},
			},
		}),
	);

	await zipWriter.add(
		"assets/minecraft/items/totem_of_undying.json",
		textReader,
	);

	const metaReader = new zip.TextReader(
		JSON.stringify({
			pack: {
				pack_format: 46,
				description: "Custom Totems (Rescourcepack)",
			},
		}),
	);

	await zipWriter.add("pack.mcmeta", metaReader);

	await zipWriter.close();

	const zipFileBlob = await zipFileWriter.getData();
	const zipFileURL = URL.createObjectURL(zipFileBlob);
	return zipFileURL;
}

async function downloadZIP() {
	const users = document
		.getElementById("users")
		.value.split("\n")
		.map((user) => user.trim())
		.filter((user) => user);
	const zipFileURL = await generateZIP(users);
	const downloadLink = document.getElementById("downloadLink");
	downloadLink.href = zipFileURL;
	downloadLink.download = `customtotems-${Date.now()}.zip`;
    downloadLink.click();
}

window.addEventListener("DOMContentLoaded", () => {
	const generateButton = document.getElementById("generateButton");
	generateButton.addEventListener("click", downloadZIP);
});
