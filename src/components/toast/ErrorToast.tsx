import { MouseEventHandler } from 'react';

export default function ErrorToast({
	isError,
	children,
	onClickCloseButton,
}: {
	isError: boolean;
	children: React.ReactNode;
	onClickCloseButton?: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<div className="toast-container position-fixed bottom-0 end-0 p-3">
			<div
				id="liveToast"
				className={`toast ${isError ? 'show' : ''} colored-toast bg-danger-transparent`}
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
			>
				<div className="toast-header bg-danger text-fixed-white">
					<strong className="me-auto">Warning</strong>
					<button
						type="button"
						className="btn-close"
						data-bs-dismiss="toast"
						aria-label="Close"
						onClick={onClickCloseButton}
					></button>
				</div>
				<div className="toast-body">{children}</div>
			</div>
		</div>
	);
}
