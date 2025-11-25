import { MouseEventHandler } from 'react';

export default function SuccessToast({
	isSuccess,
	children,
	onClickCloseButton,
}: {
	isSuccess: boolean;
	children: React.ReactNode;
	onClickCloseButton?: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<div className="toast-container position-fixed bottom-0 end-0 p-3">
			<div
				id="liveToast"
				className={`toast ${isSuccess ? 'show' : ''} colored-toast bg-success-transparent`}
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
			>
				<div className="toast-header bg-success text-fixed-white">
					<strong className="me-auto">Success !</strong>
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
