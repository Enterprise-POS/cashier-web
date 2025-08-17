'use client';

import { emailAndPasswordSignUpAction } from '@/_lib/action';
import { all_routes as routes } from '@/components/core/data/all_routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type PasswordVisibility = { [key: string]: boolean };

export default function Register() {
	const router = useRouter();

	const [isFormLoading, setFormLoading] = useState(false);

	const [isShowError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({
		password: false,
		confirmPassword: false,
	});

	const togglePasswordVisibility = (field: string) => {
		setPasswordVisibility((prevState: PasswordVisibility) => ({
			...prevState,
			[field]: !prevState[field],
		}));
	};

	const handleFormAction = async function (formData: FormData) {
		if (isFormLoading) return;
		setFormLoading(true);

		const { error } = await emailAndPasswordSignUpAction(formData);
		if (error !== null) {
			// show error
			console.warn('DEV NOTE: ', error);

			if (error.includes('duplicate key value violates unique constraint "user_email_key"')) {
				setErrorMessage(
					'The email you entered is already associated with another account. Please use a different email address.'
				);
				setShowError(true);
			} else {
				setErrorMessage(error);
				setShowError(true);
			}
		} else {
			// redirect to dashboard page / index
			// refresh will re-render the UI
			setShowError(false);
			router.push('/');
			router.refresh();
		}

		setFormLoading(false);
	};

	const handleCloseError = function () {
		setShowError(false);
	};

	return (
		<>
			{/* Main Wrapper */}
			<div className="main-wrapper">
				<div className="account-content">
					<div className="login-wrapper register-wrap bg-img">
						<div className="login-content authent-content">
							<form
								onSubmit={e => {
									// If use action: react don't want to render the UI
									e.preventDefault();
									const formData = new FormData(e.currentTarget);
									handleFormAction(formData);
								}}
							>
								<div className="login-userset">
									{/* <div className="login-logo logo-normal">
										<img src="assets/img/logo.png" alt="img" />
									</div> */}
									{/* <Link href={routes.dashboard} className="login-logo logo-white">
										<img src="assets/img/logo-white.png" alt="Img" />
									</Link> */}
									<div className="login-userheading">
										<h3>Sign up</h3>
										<h4>Create New Enterprise POS Account</h4>
									</div>

									{isShowError && (
										<>
											<div className="card border-0">
												<div className="alert alert-danger border border-danger mb-0 p-3">
													<div className="d-flex align-items-start">
														<div className="me-2">
															<i className="feather-alert-octagon flex-shrink-0" />
														</div>
														<div className="text-danger w-100">
															<div className="fw-semibold d-flex justify-content-between">
																Warning
																<button
																	onClick={e => {
																		e.preventDefault();
																		handleCloseError();
																	}}
																	type="button"
																	className="btn-close p-0"
																	data-bs-dismiss="alert"
																	aria-label="Close"
																>
																	<i className="fas fa-xmark" />
																</button>
															</div>
															<div className="fs-12 op-8 mb-1">{errorMessage}</div>
														</div>
													</div>
												</div>
											</div>
										</>
									)}

									<div className="mb-3">
										<label className="form-label">
											Name <span className="text-danger"> *</span>
										</label>
										<div className="input-group">
											<input
												type="text"
												defaultValue=""
												className="form-control border-end-0"
												name="name"
												disabled={isFormLoading}
											/>
											<span className="input-group-text border-start-0">
												<i className="ti ti-user" />
											</span>
										</div>
									</div>
									<div className="mb-3">
										<label className="form-label">
											Email <span className="text-danger"> *</span>
										</label>
										<div className="input-group">
											<input
												type="text"
												defaultValue=""
												className="form-control border-end-0"
												name="email"
												disabled={isFormLoading}
											/>
											<span className="input-group-text border-start-0">
												<i className="ti ti-mail" />
											</span>
										</div>
									</div>
									<div className="mb-3">
										<label className="form-label">
											Password <span className="text-danger"> *</span>
										</label>
										<div className="pass-group">
											<input
												type={passwordVisibility ? 'text' : 'password'}
												className="pass-input form-control"
												name="password"
												disabled={isFormLoading}
											/>
											<span
												className={`ti toggle-password ${passwordVisibility ? 'ti-eye' : 'ti-eye-off'}`}
												onClick={() => togglePasswordVisibility('password')}
											></span>
										</div>
									</div>
									<div className="mb-3">
										<label className="form-label">
											Confirm Password <span className="text-danger"> *</span>
										</label>
										<div className="pass-group">
											<input
												type={passwordVisibility.confirmPassword ? 'text' : 'password'}
												className="pass-input form-control"
												name="password2"
												disabled={isFormLoading}
											/>
											<span
												className={`ti toggle-password ${passwordVisibility.confirmPassword ? 'ti-eye' : 'ti-eye-off'}`}
												onClick={() => togglePasswordVisibility('confirmPassword')}
											></span>
										</div>
									</div>
									<div className="form-login authentication-check">
										{/* <div className="row">
											<div className="col-sm-8">
												<div className="custom-control custom-checkbox justify-content-start">
													<div className="custom-control custom-checkbox">
														<label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
															<input type="checkbox" />
															<span className="checkmarks" />I agree to the{' '}
															<Link href="#" className="text-primary">
																Terms &amp; Privacy
															</Link>
														</label>
													</div>
												</div>
											</div>
										</div> */}
									</div>
									<div className="form-login">
										<button type="submit" className="btn btn-login" disabled={isFormLoading}>
											{isFormLoading ? 'Signing up...' : 'Sign Up'}
										</button>
									</div>
									<div className="signinform">
										<h4>
											Already have an account ?{' '}
											<Link href={routes.login} className="hover-a">
												Sign In Instead
											</Link>
										</h4>
									</div>
									<div className="form-setlogin or-text">
										<h4>OR</h4>
									</div>
									<div className="mt-2">
										<div className="d-flex align-items-center justify-content-center flex-wrap">
											<div className="text-center me-2 flex-fill">
												<Link
													href="#"
													className="br-10 p-2 btn btn-info d-flex align-items-center justify-content-center"
												>
													<img className="img-fluid m-1" src="assets/img/icons/facebook-logo.svg" alt="Facebook" />
												</Link>
											</div>
											<div className="text-center me-2 flex-fill">
												<Link
													href="#"
													className="btn btn-white br-10 p-2  border d-flex align-items-center justify-content-center"
												>
													<img className="img-fluid m-1" src="assets/img/icons/google-logo.svg" alt="Facebook" />
												</Link>
											</div>
											<div className="text-center flex-fill">
												<Link
													href="#"
													className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
												>
													<img className="img-fluid m-1" src="assets/img/icons/apple-logo.svg" alt="Apple" />
												</Link>
											</div>
										</div>
									</div>
									<div className="my-4 d-flex justify-content-center align-items-center copyright-text">
										<p>Copyright © {new Date().getFullYear().toString()} Enterprise POS</p>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* /Main Wrapper */}
		</>
	);
}
