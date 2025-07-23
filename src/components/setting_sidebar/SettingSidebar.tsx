'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { all_routes as routes } from '@/components/core/data/all_routes';

import 'react-perfect-scrollbar/dist/css/styles.css';

/*
	I don't apply the isMounted here because the parent element already do that for this component
*/
function SettingsSideBar(props: any) {
	const pathname = usePathname(); // Use usePathname to get the current route path

	const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
	const [isWebsiteSettingsOpen, setIsWebsiteSettingsOpen] = useState(false);
	const [isAppSettingsOpen, setIsAppSettingsOpen] = useState(false);
	const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);
	const [isFinancialSettingsOpen, setIsFinancialSettingsOpen] = useState(false);
	const [isOtherSettingsOpen, setIsOtherSettingsOpen] = useState(false);
	const [isSubmenutwo, setSubmenutwo] = useState(false);
	const [isSms, setSms] = useState(false);

	const toggleGeneralSettings = () => {
		setIsGeneralSettingsOpen(!isGeneralSettingsOpen);
	};

	const toggleWebsiteSettings = () => {
		setIsWebsiteSettingsOpen(!isWebsiteSettingsOpen);
	};

	const toggleAppSettings = () => {
		setIsAppSettingsOpen(prev => !prev);
	};

	const toggleSystemSettings = () => {
		setIsSystemSettingsOpen(prev => !prev);
	};

	const toggleFinancialSettings = () => {
		setIsFinancialSettingsOpen(prev => !prev);
	};

	const toggleOtherSettings = () => {
		setIsOtherSettingsOpen(prev => !prev);
	};

	const toggleSubmenutwo = () => {
		setSubmenutwo(prev => !prev);
	};

	const toggleSms = () => {
		setSms(prev => !prev);
	};

	return (
		<div>
			<div className="settings-sidebar" id="sidebar2">
				<div className="sidebar-inner slimscroll">
					<PerfectScrollbar
						style={{ marginRight: -5, height: 800 }}
						// autoHides
						// autoHeight
						// autoHeightMin={400} // Set a minimum height for the scrollbar
						// {...props}
						// width={100}
						// autoHideTimeout={1000}
						// autoHideDuration={200}
						// autoHeight
						// autoHeightMin={0}
						// autoHeightMax="95vh"
						// thumbMinSize={30}
						// universal={false}
						// hideTracksWhenNotNeeded={true}
					>
						<div id="sidebar-menu5" className="sidebar-menu">
							<h4 className="fw-bold fs-18 mb-2 pb-2">Settings</h4>
							<ul>
								<li className="submenu-open">
									<ul>
										<li className="submenu">
											<Link
												href="#"
												onClick={toggleGeneralSettings}
												className={
													pathname === routes.profileSettings ||
													pathname === routes.securitysettings ||
													pathname === routes.notification ||
													pathname == routes.connectedapps
														? 'active subdrop'
														: ''
												}
											>
												<i className="ti ti-settings fs-18"></i>
												<span className="fs-14 fw-medium ms-2">General Settings</span>
												<span className="menu-arrow" />
											</Link>
											<ul
												style={{
													display: isGeneralSettingsOpen ? 'block' : 'none',
												}}
											>
												<li>
													<Link
														href={routes.profileSettings}
														className={pathname === routes.profileSettings ? 'active' : ''}
													>
														Profile
													</Link>
												</li>
												{/* <li>
													<Link
														href={routes.securitysettings}
														className={pathname === routes.securitysettings ? 'active' : ''}
													>
														Security
													</Link>
												</li> */}
												{/* <li>
													<Link href={routes.notification} className={pathname === routes.notification ? 'active' : ''}>
														Notifications
													</Link>
												</li> */}
												{/* <li>
													<Link href={routes.connectedapps} className={pathname === routes.connectedapps ? 'active' : ''}>
														Connected Apps
													</Link>
												</li> */}
											</ul>
										</li>
										<li className="submenu">
											<Link
												href="#"
												onClick={toggleWebsiteSettings}
												className={
													pathname === routes.systemsettings ||
													pathname === routes.companysettings ||
													pathname === routes.localizationsettings ||
													pathname == routes.prefixes ||
													pathname == routes.preference ||
													pathname == routes.appearance ||
													pathname == routes.socialauthendication ||
													pathname == routes.languageSettings
														? 'active subdrop'
														: ''
												}
											>
												<i className="ti ti-world fs-18"></i>
												<span className="fs-14 fw-medium ms-2">Website Settings</span>
												<span className="menu-arrow" />
											</Link>
											<ul
												style={{
													display: isWebsiteSettingsOpen ? 'block' : 'none',
												}}
											>
												{/* <li>
													<Link
														href={routes.systemsettings}
														className={pathname === routes.systemsettings ? 'active' : ''}
													>
														System Settings
													</Link>
												</li> */}
												{/* <li>
													<Link
														href={routes.companysettings}
														className={pathname === routes.companysettings ? 'active' : ''}
													>
														Company Settings
													</Link>
												</li> */}
												{/* <li>
													<Link
														href={routes.localizationsettings}
														className={pathname === routes.localizationsettings ? 'active' : ''}
													>
														Localization
													</Link>
												</li> */}
												{/* <li>
													<Link href={routes.prefixes} className={pathname === routes.prefixes ? 'active' : ''}>
														Prefixes
													</Link>
												</li> */}
												{/* <li>
													<Link href={routes.preference} className={pathname === routes.preference ? 'active' : ''}>
														Preference
													</Link>
												</li> */}
												{/* <li>
													<Link href={routes.appearance} className={pathname === routes.appearance ? 'active' : ''}>
														Appearance
													</Link>
												</li> */}
												{/* <li>
													<Link
														href={routes.socialauthendication}
														className={pathname === routes.socialauthendication ? 'active' : ''}
													>
														Social Authentication
													</Link>
												</li> */}
												<li>
													<Link
														href={routes.languageSettings}
														className={pathname === routes.languageSettings ? 'active' : ''}
													>
														Language
													</Link>
												</li>
											</ul>
										</li>
										{/* <li className="submenu">
											<Link
												href="#"
												onClick={toggleAppSettings}
												className={
													pathname === routes.invoicesettings ||
													pathname === routes.invoicetemplate ||
													pathname === routes.printersettings ||
													pathname == routes.possettings ||
													pathname == routes.signatures ||
													pathname == routes.customfields
														? 'active subdrop'
														: ''
												}
											>
												<i className="ti ti-device-mobile fs-18"></i>
												<span className="fs-14 fw-medium ms-2">App Settings</span>
												<span className="menu-arrow" />
											</Link>
											<ul
												style={{
													display: isAppSettingsOpen ? 'block' : 'none',
												}}
											>
												<li>
													<Link
														href={routes.invoicesettings}
														className={pathname === routes.invoicesettings ? 'active' : ''}
													>
														Invoice
													</Link>
												</li>
												<li>
													<Link
														href={routes.invoicetemplate}
														className={pathname === routes.invoicetemplate ? 'active' : ''}
													>
														Invoice Templates
													</Link>
												</li>
												<li>
													<Link
														href={routes.printersettings}
														className={pathname === routes.printersettings ? 'active' : ''}
													>
														Printer
													</Link>
												</li>
												<li>
													<Link href={routes.possettings} className={pathname === routes.possettings ? 'active' : ''}>
														POS
													</Link>
												</li>
												<li>
													<Link href={routes.signatures} className={pathname === routes.signatures ? 'active' : ''}>
														Signatures
													</Link>
												</li>
												<li>
													<Link href={routes.customfields} className={pathname === routes.customfields ? 'active' : ''}>
														Custom Fields
													</Link>
												</li>
											</ul>
										</li> */}
										{/* <li className="submenu">
											<Link
												href="#"
												onClick={toggleSystemSettings}
												className={
													pathname === routes.invoicesettings ||
													pathname === routes.invoicetemplate ||
													pathname === routes.printersettings ||
													pathname == routes.possettings ||
													pathname == routes.signatures ||
													pathname == routes.customfields ||
													pathname == routes.emailsettings ||
													pathname == routes.emailtemplate ||
													pathname == routes.smssettings ||
													pathname == routes.smstemplate
														? 'active subdrop'
														: ''
												}
											>
												<i className="ti ti-device-desktop fs-18"></i>
												<span className="fs-14 fw-medium ms-2">System Settings</span>
												<span className="menu-arrow" />
											</Link>
											<ul
												style={{
													display: isSystemSettingsOpen ? 'block' : 'none',
												}}
											>
												<li>
													<Link
														href="#"
														className={`submenu-two ${
															pathname === routes.emailsettings || pathname === routes.emailtemplate ? 'active' : ''
														}`}
														onClick={toggleSubmenutwo}
													>
														Email
														<span className="menu-arrow inside-submenu"></span>
													</Link>
													<ul style={{ display: isSubmenutwo ? 'block' : 'none' }}>
														<li>
															<Link
																href={routes.emailsettings}
																className={`${pathname === routes.emailsettings ? 'active' : ''}`}
															>
																Email Settings
															</Link>
														</li>
														<li>
															<Link
																href={routes.emailtemplate}
																className={`${pathname === routes.emailtemplate ? 'active' : ''}`}
															>
																Email Templates
															</Link>
														</li>
													</ul>
												</li>
												<li>
													<Link
														href="#"
														className={`submenu-two ${
															pathname === routes.smssettings || pathname == routes.smstemplate ? 'active' : ''
														}`}
														onClick={toggleSms}
													>
														SMS Gateways
														<span className="menu-arrow inside-submenu"></span>
													</Link>
													<ul style={{ display: isSms ? 'block' : 'none' }}>
														<li>
															<Link
																href={routes.smssettings}
																className={`${pathname === routes.smssettings ? 'active' : ''}`}
															>
																SMS Settings
															</Link>
														</li>
														<li>
															<Link href={routes.smstemplate}>SMS Templates</Link>
														</li>
													</ul>
												</li>
												<li>
													<Link href={routes.otpsettings} className={pathname === routes.otpsettings ? 'active' : ''}>
														OTP
													</Link>
												</li>
												<li>
													<Link href={routes.gdbrsettings} className={pathname === routes.gdbrsettings ? 'active' : ''}>
														GDPR Cookies
													</Link>
												</li>
											</ul>
										</li> */}
										{/* <li className="submenu">
											<Link
												href="#"
												// className={`active ${
												//   isFinancialSettingsOpen ? "subdrop" : ""
												// }`}
												onClick={toggleFinancialSettings}
												className={
													pathname === routes.paymentgateway ||
													pathname === routes.banksettingslist ||
													pathname === routes.taxrates ||
													pathname == routes.currencysettings
														? 'active subdrop'
														: ''
												}
											>
												<i className="ti ti-settings-dollar fs-18"></i>
												<span className="fs-14 fw-medium ms-2">Financial Settings</span>
												<span className="menu-arrow" />
											</Link>
											<ul
												style={{
													display: isFinancialSettingsOpen ? 'block' : 'none',
												}}
											>
												<li>
													<Link
														href={routes.paymentgateway}
														className={pathname === routes.paymentgateway ? 'active' : ''}
													>
														Payment Gateway
													</Link>
												</li>
												<li>
													<Link
														href={routes.banksettingsgrid}
														className={pathname === routes.banksettingsgrid ? 'active' : ''}
													>
														Bank Accounts
													</Link>
												</li>
												<li>
													<Link href={routes.taxrates} className={pathname === routes.taxrates ? 'active' : ''}>
														Tax Rates
													</Link>
												</li>
												<li>
													<Link
														href={routes.currencysettings}
														className={pathname === routes.currencysettings ? 'active' : ''}
													>
														Currencies
													</Link>
												</li>
											</ul>
										</li> */}
										{/* <li className="submenu">
											<Link
												href="#"
												onClick={toggleOtherSettings}
												className={
													pathname === routes.storagesettings || pathname === routes.banipaddress ? 'active subdrop' : ''
												}
											>
												<i className="ti ti-settings-2 fs-18"></i>
												<span className="fs-14 fw-medium ms-2">Other Settings</span>
												<span className="menu-arrow" />
											</Link>
											<ul
												style={{
													display: isOtherSettingsOpen ? 'block' : 'none',
												}}
											>
												<li>
													<Link
														href={routes.storagesettings}
														className={pathname === routes.storagesettings ? 'active' : ''}
													>
														Storage
													</Link>
												</li>
												<li>
													<Link href={routes.banipaddress} className={pathname === routes.banipaddress ? 'active' : ''}>
														Ban IP Address
													</Link>
												</li>
											</ul>
										</li> */}
									</ul>
								</li>
							</ul>
						</div>
					</PerfectScrollbar>
				</div>
			</div>
		</div>
	);
}

export default SettingsSideBar;
