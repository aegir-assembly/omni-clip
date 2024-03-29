import {css} from "@benev/slate"

export const styles = css`
	.track {
		background: rgb(0 0 0 / 38%);
		display: flex;
		height: 50px;
		outline: 1px solid #181818;
	}

	.indicators {
		width: 100%;
		position: relative;

		& .indicator-area {
			position: absolute;
			width: 100%;
			height: 14px;
			top: -7px;
			z-index: 3;
		}

		& .indicator {
			display: none;
			z-index: 1;
			position: relative;
			align-items: center;
			width: 100%;
			outline: 1px solid green;

			&[data-indicate] {
				display: flex;
				background: #0080002e;

			}
		}
	}
`
