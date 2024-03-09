import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Video} from "./types.js"
import loadingSvg from "../../icons/loading.svg.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import binSvg from "../../icons/gravity-ui/bin.svg.js"
import {shadow_component} from "../../context/slate.js"
import {loadingPlaceholder} from "../../views/loading-placeholder/view.js"

export const OmniMedia = shadow_component(use => {
	use.watch(() => use.context.state.timeline)
	use.styles(styles)
	const media_controller = use.context.controllers.media
	const timeline_actions = use.context.actions.timeline_actions
	const [media, setMedia, getMedia] = use.state<Video[]>([])
	const [placeholders, setPlaceholders] = use.state<any[]>([])

	use.mount(() => {
		media_controller.get_imported_files().then(async media => {
			setPlaceholders(Array.apply(null, Array(media.length)))
			const video_files = await media_controller.create_videos_from_video_files(media)
			setMedia([...getMedia(), ...video_files])
		})
		const unsub = media_controller.on_media_change(async (change) => {
			if(change.action === "added") {
				const video_files = await media_controller.create_videos_from_video_files(change.files)
				setMedia([...getMedia(), ...video_files])
			}
			if(change.action === "removed") {
				change.files.forEach(file => {
					const filtered = getMedia().filter(a => a.hash !== file.hash)
					setMedia(filtered)
				})
			}
		})
		return () => unsub()
	})

	const video_on_pointer = {
		enter(video: HTMLVideoElement) {
			video.play()
		},
		leave(video: HTMLVideoElement) {
			video.pause()
			video.currentTime = 0
		}
	}

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<form>
			<label class="import-btn" for="import">Import Media Files</label>
			<input type="file" accept="image/*, video/mp4" id="import" class="hide" @change=${(e: Event) => media_controller.import_file(e.target as HTMLInputElement)}>
		</form>
		<div class="media">
			${media.length === 0
				? placeholders.map(_ => html`<div class="box placeholder">${loadingSvg}</div>`)
				: null}
			${media.map(m => html`
				<div
					@pointerenter=${() => video_on_pointer.enter(m.element)}
					@pointerleave=${() => video_on_pointer.leave(m.element)}
					class="box"
				>
					<div class="media-element">
						${m.element}
						<div @click=${() => timeline_actions.add_video_effect(m, use.context.controllers.compositor)} class="add-btn">${addSvg}</div>
						<div @click=${() => media_controller.delete_file(m)} class="delete-btn">${binSvg}</div>
					</div>
					<span class="media-name">${m.file.name}</span>
				</div>
			`)}
		</div>
	`)
})

