import {Compositor} from "../controller.js"
import {ImageEffect} from "../../timeline/types.js"

export class ImageManager extends Map<string, {element: HTMLImageElement, file: File}> {

	constructor(private compositor: Compositor) {
		super()
	}

	async add_image(effect: ImageEffect, file: File) {
		let img = new Image()
		img.src = effect.url
		await new Promise(r => img.onload=r)
		this.set(effect.id, {element: img, file})
	}

	draw_image_frame(effect: ImageEffect) {
		const {element} = this.get(effect.id)!
		this.compositor.ctx!.drawImage(
			element,
			0,
			0,
			this.compositor.canvas.width,
			this.compositor.canvas.height
		)
	}
}
