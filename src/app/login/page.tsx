'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { emailAndPasswordSignInAction } from '@/_lib/action';
import { all_routes as routes } from '@/components/core/data/all_routes';

export default function Login() {
	const router = useRouter();
	const [isPasswordVisible, setPasswordVisible] = useState(false);
	const [isFormLoading, setFormLoading] = useState(false);

	const [isShowError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const [isShowSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const togglePasswordVisibility = () => {
		setPasswordVisible(prevState => !prevState);
	};

	const handleFormAction = async function (formData: FormData) {
		if (isFormLoading) return;
		setFormLoading(true);

		const { result, error } = await emailAndPasswordSignInAction(formData);
		if (error !== null) {
			// show error
			console.warn('DEV NOTE: ', error);
			setErrorMessage(error);
			setShowError(true);
			setShowSuccess(false);
		} else {
			// redirect to dashboard page / index
			// refresh will re-render the UI
			setShowError(false);
			setShowSuccess(true);
			setSuccessMessage(result!);
			router.push('/');

			// Will force to re-render again header
			router.refresh();
		}

		setFormLoading(false);
	};

	const handleCloseError = function () {
		setShowError(false);
	};
	const handleCloseSuccess = function () {
		setShowSuccess(false);
	};

	return (
		<>
			{/* Main Wrapper */}
			<div className="main-wrapper">
				<div className="account-content">
					<div className="login-wrapper bg-img">
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
									<div className="login-logo logo-normal">
										<Image src="/assets/img/logo.png" alt="img" width={150} height={45} />
									</div>
									<Link href={routes.dashboard} className="login-logo logo-white">
										<Image src="/assets/img/logo-white.png" alt="Img" width={150} height={45} />
									</Link>
									<div className="login-userheading">
										<h3>Sign In</h3>
										<h4 className="fs-16">Access the Enterprise POS panel using your email and passcode.</h4>
									</div>
									{isShowError && (
										<div className="card border-0">
											<div className="alert alert-danger border border-danger mb-0 p-3">
												<div className="d-flex align-items-start">
													<div className="me-2">
														<i className="feather-alert-octagon flex-shrink-0" />
													</div>
													<div className="text-danger w-100">
														<div className="fw-semibold d-flex justify-content-between">
															Could not signing in
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
									)}
									{isShowSuccess && (
										<div className="alert alert-success d-flex align-items-center" role="alert">
											<i className="feather-check-circle flex-shrink-0 me-2" />
											<div>Welcome !</div>
										</div>
									)}
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
												type={isPasswordVisible ? 'text' : 'password'}
												className="pass-input form-control"
												name="password"
												disabled={isFormLoading}
											/>
											<span
												className={`text-gray-9 ti toggle-password ${isPasswordVisible ? 'ti-eye' : 'ti-eye-off'}`}
												onClick={togglePasswordVisibility}
											></span>
										</div>
									</div>
									<div className="form-login authentication-check">
										<div className="row">
											<div className="col-12 d-flex align-items-center justify-content-between">
												<div className="custom-control custom-checkbox">
													<label className="checkboxs ps-4 mb-0 pb-0 line-height-1 fs-16 text-gray-6">
														<input type="checkbox" className="form-control" />
														<span className="checkmarks" />
														Remember me
													</label>
												</div>
												<div className="text-end">
													<Link className="text-orange fs-16 fw-medium" href={routes.forgotPassword}>
														Forgot Password?
													</Link>
												</div>
											</div>
										</div>
									</div>
									<div className="form-login">
										<button type="submit" className="btn btn-primary w-100" disabled={isFormLoading}>
											{isFormLoading ? 'Signing in...' : 'Sign In'}
										</button>
									</div>
									<div className="signinform">
										<h4>
											New on our platform?
											<Link href={routes.register} className="hover-a">
												{' '}
												Create an account
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
													<Image
														width={24}
														height={24}
														className="img-fluid mImage"
														src="/assets/img/icons/facebook-logo.svg"
														alt="Facebook"
													/>
												</Link>
											</div>
											<div className="text-center me-2 flex-fill">
												<Link
													href="#"
													className="btn btn-white br-10 p-2  border d-flex align-items-center justify-content-center"
												>
													<Image
														width={24}
														height={24}
														className="img-fluid mImage"
														src="/assets/img/icons/google-logo.svg"
														alt="Facebook"
													/>
												</Link>
											</div>
											<div className="text-center flex-fill">
												<Link
													href="#"
													className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
												>
													<Image
														width={24}
														height={24}
														className="img-fluid mImage"
														src="/assets/img/icons/apple-logo.svg"
														alt="Apple"
													/>
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
