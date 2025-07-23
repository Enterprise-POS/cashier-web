'use client';
import { all_routes as routes } from '@/components/core/data/all_routes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
	const [isPasswordVisible, setPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisible(prevState => !prevState);
	};

	return (
		<>
			{/* Main Wrapper */}
			<div className="main-wrapper">
				<div className="account-content">
					<div className="login-wrapper bg-img">
						<div className="login-content authent-content">
							<form>
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
									<div className="mb-3">
										<label className="form-label">
											Email <span className="text-danger"> *</span>
										</label>
										<div className="input-group">
											<input type="text" defaultValue="" className="form-control border-end-0" />
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
											<input type={isPasswordVisible ? 'text' : 'password'} className="pass-input form-control" />
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
										<Link href={routes.newdashboard} className="btn btn-primary w-100">
											Sign In
										</Link>
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
