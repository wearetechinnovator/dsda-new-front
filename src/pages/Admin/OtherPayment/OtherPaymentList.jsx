import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav';
import { useNavigate } from 'react-router-dom';
import useExportTable from '../../../hooks/useExportTable';
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import downloadPdf from '../../../helper/downloadPdf';
import DataShimmer from '../../../components/Admin/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, SelectPicker, Whisper } from 'rsuite';
import { Icons } from '../../../helper/icons';
import Pagination from '../../../components/Admin/Pagination';
import useSearchTable from '../../../hooks/useSearchTable';
import useApi from '../../../hooks/useApi';
import useSetTableFilter from '../../../hooks/useSetTableFilter';
import NoData from '../../../components/Admin/NoData';


const OtherPaymentList = ({ mode }) => {
	const toast = useMyToaster();
	const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
	const { getFilterState, setFilterState } = useSetTableFilter();
	const savedFilter = getFilterState("other-payment");
	const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
	const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
	const [totalData, setTotalData] = useState()
	const [selected, setSelected] = useState([]);
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const tableRef = useRef(null);
	const exportData = useMemo(() => {
		return data && data.map((d, _) => ({
			"Hotel Name": d.other_payment_hotel_id?.hotel_name,
			"Payment Date": d.other_payment_date,
			"Amount": d.other_payment_amount,
			"Purpose": d.other_payment_purpose,
			"Status": d.other_payment_payment_init === "1" ? (d.other_payment_payment_status == "0" ?
				'Failed' :
				(d.other_payment_payment_status == "1" ?
					'Success' : 'Processing')) : 'Payment Not initiated',
			"Ref. ID": d.other_payment_payment_ref_no,
		}));
	}, [data]);
	const [loading, setLoading] = useState(true);
	const searchTable = useSearchTable();
	const { deleteData, restoreData } = useApi()
	const [isTrash, setIsTrash] = useState(false);
	const timeRef = useRef(null);
	const [allHotels, setAllHotels] = useState([]);
	const [selectedHotel, setSelectedHotel] = useState(null);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [status, setStatus] = useState("all");
	const [purpose, setPurpose] = useState('');
	const [totalAmount, setTotalAmount] = useState(0);




	// Get Hotel List for
	const getHotelList = async () => {
		try {
			const data = {
				token: Cookies.get("token")
			}
			const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
			const req = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			});
			const res = await req.json();
			setAllHotels([...res.data])

		} catch (error) {

		}
	}

	useEffect(() => {
		getHotelList();
	}, [])

	// Get data;
	const get = async () => {
		setLoading(true);

		try {
			const data = {
				token: Cookies.get("token"),
				trash: isTrash,
				page: activePage,
				limit: dataLimit
			}
			setFilterState("other-payment", dataLimit, activePage);
			const url = process.env.REACT_APP_MASTER_API + `/other-payments/get-payment`;
			const req = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			});
			const res = await req.json();

			setTotalData(res.total)
			setData([...res.data])
			setLoading(false);

			const totalAmount = res.data.reduce((acc, i) => {
				return acc += Number(i.other_payment_amount);
			}, 0)
			setTotalAmount(totalAmount)

		} catch (error) {
			setLoading(false);
		}
	}
	useEffect(() => {
		get();
	}, [isTrash, dataLimit, activePage])

	const searchTableDatabase = (e) => {
		const txt = e.target.value;
		if (timeRef.current) clearTimeout(timeRef.current);

		timeRef.current = setTimeout(async () => {
			if (!txt) {
				get();
				return;
			}

			try {
				const data = {
					token: Cookies.get("token"),
					search: txt
				}
				const url = process.env.REACT_APP_MASTER_API + `/other-payments/get-payment`;
				const req = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(data)
				});
				const res = await req.json();

				setTotalData(res.length)
				setData([...res])

			} catch (error) {

			}

		}, 300)

	}

	const selectAll = (e) => {
		if (e.target.checked) {
			setSelected(data.map((item, _) => item._id));
		} else {
			setSelected([]);
		}
	};

	const handleCheckboxChange = (id) => {
		setSelected((prevSelected) => {
			if (prevSelected.includes(id)) {
				return prevSelected.filter((previd, _) => previd !== id);
			} else {
				return [...prevSelected, id];
			}
		});
	};

	const searchHotelTableDatabase = (txt) => {
		if (txt === "") return;
		if (timeRef.current) clearTimeout(timeRef.current);

		timeRef.current = setTimeout(async () => {
			try {
				const data = {
					token: Cookies.get("token"),
					search: txt
				}
				const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
				const req = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(data)
				});
				const res = await req.json();
				setAllHotels([...res])
			} catch (error) {

			}

		}, 350)
	}

	const exportTable = async (whichType) => {
		if (whichType === "copy") {
			copyTable("table"); // Pass tableid
		}
		else if (whichType === "excel") {
			downloadExcel(exportData, 'other-payments.xlsx') // Pass data and filename
		}
		else if (whichType === "print") {
			printTable(tableRef, "Payment List"); // Pass table ref and title
		}
		else if (whichType === "pdf") {
			let document = exportPdf('Other Payment List', exportData);
			downloadPdf(document);
		}
	}

	const handleFilter = async () => {
		setLoading(true);
		(async () => {
			try {
				const data = {
					token: Cookies.get("token"),
					page: activePage,
					limit: dataLimit,
					startDate: startDate,
					endDate: endDate,
					hotelId: selectedHotel,
					status: status,
					purpose: purpose
				}

				const url = process.env.REACT_APP_MASTER_API + `/other-payments/get-payment`;
				const req = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(data)
				});
				const res = await req.json();

				if (req.status !== 200) {
					setLoading(false);
					return toast(res.err, 'error');
				}
				setData([...res.data])
				setTotalData(res.total)
				setLoading(false);

				const totalAmount = res.data.reduce((acc, i) => {
					return acc += Number(i.other_payment_amount);
				}, 0)
				setTotalAmount(totalAmount)

			} catch (error) {

			}
		})()
	}


	const handleResetFilter = () => {
		window.location.reload();
	}

	return (
		<>
			<Nav title={"Manage Extra Payment"} />
			<main id='main'>
				<SideNav />
				<Tooltip id='itemTooltip' />
				<div className='content__body'>

					{
						!loading ? (
							<>
								<div className='content__body__main'>
									<div id='itemFilter' className='w-full'>
										<p className='font-semibold uppercase'>Filter</p>
										<div className='flex flex-col md:flex-row md:gap-4 w-full mt-3 text-[13px]'>
											<div className='w-full'>
												<p className='mb-1'>Hotel List</p>
												<SelectPicker
													block
													data={[
														...allHotels.map((item) => ({
															label: item.hotel_name,
															value: item._id
														}))
													]}
													style={{ width: '100%' }}
													onChange={(v) => setSelectedHotel(v)}
													value={selectedHotel}
													placeholder="Select"
													searchable={true}
													cleanable={true}
													placement='bottomEnd'
													onSearch={(serachTxt) => searchHotelTableDatabase(serachTxt)}
													onClean={getHotelList}
												/>
											</div>
											<div className='w-full'>
												<p className='mb-1'>Payment Start Date</p>
												<input type='date'
													onChange={(e) => setStartDate(e.target.value)}
													value={startDate}
												/>
											</div>

											<div className='w-full'>
												<p className='mb-1'>Payment End Date</p>
												<input type='date'
													onChange={(e) => setEndDate(e.target.value)}
													value={endDate}
												/>
											</div>
										</div>

										<div className='flex flex-col md:flex-row md:gap-4 w-full mt-5 text-[13px]'>
											<div className='w-full'>
												<p>Purpose <span className='required__text'>*</span></p>
												<input type='text'
													onChange={(e) => setPurpose(e.target.value)}
													value={purpose}
												/>
												<div className='flex justify-start gap-2 mt-2'>
													<div className='search__sug__badge' onClick={(e) => setPurpose('Mismatch')}>
														Mismatch
													</div>
													<div className='search__sug__badge' onClick={(e) => setPurpose("Fine")}>
														Fine
													</div>
												</div>
											</div>
											<div className='w-full'>
												<p>Status</p>
												<select
													onChange={(e) => setStatus(e.target.value)}
													value={status}
												>
													<option value="all">All</option>
													<option value="ni">No initiated</option>
													<option value="0">Failed</option>
													<option value="1">Success</option>
													<option value="2">Pending</option>
												</select>
											</div>
										</div>
										<div className='form__btn__grp filter'>
											<button className='reset__btn' onClick={handleResetFilter}>
												<Icons.RESET />
												Reset
											</button>
											<button className='save__btn' onClick={() => handleFilter()}>
												<Icons.SEARCH />
												Search
											</button>
										</div>
									</div>
								</div>


								<div className='content__body__main mt-4'>
									<div className='w-full flex gap-1 items-center border-b pb-1'>
										<Icons.RUPES />
										<span className='font-semibold'>Extra Payment Table</span>
									</div>
									<div className={`add_new_compnent`}>
										<div className='flex flex-col md:flex-row justify-between items-center'>
											<div>
												<select value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
													<option value={5}>5</option>
													<option value={10}>10</option>
													<option value={50}>50</option>
													<option value={100}>100</option>
													<option value={500}>500</option>
													<option value={1000}>1000</option>
													<option value={5000}>5000</option>
													<option value={10000}>10000</option>
													<option value={50000}>50000</option>
													<option value={totalData}>All</option>
												</select>
											</div>
											<div className='flex flex-col md:flex-row items-center gap-2'>
												<div className='flex w-full flex-col lg:w-[300px]'>
													<input type='search'
														placeholder='Search Ref ID...'
														onChange={searchTableDatabase}
													/>
												</div>
												{!isTrash && <button
													onClick={() => deleteData(selected, "other-payments", true)}
													className={`${selected.length > 0 ? 'bg-red-400 text-white' : 'bg-gray-100'}`}>
													<Icons.DELETE className='text-lg' />
													Trash
												</button>}
												{
													isTrash && <button
														onClick={() => restoreData(selected, "other-payments")}
														className={`${selected.length > 0 ? 'bg-[#003E32] text-white' : 'bg-gray-100'}`}>
														<Icons.RESTORE className='text-lg' />
														Restore
													</button>
												}
												<button
													onClick={() => deleteData(selected, "other-payments")}
													className={`${selected.length > 0 ? 'bg-red-400 text-white' : 'bg-gray-100'} border`}>
													<Icons.DELETE className='text-lg' />
													Delete
												</button>
												<button
													onClick={() => {
														setIsTrash(pv => {
															return !pv;
														})
													}}
													className={'bg-[#003E32] text-white'}>
													{
														isTrash ? <Icons.FOLDER_OPEN className='text-lg' />
															: <Icons.FOLDER className='text-lg' />
													}
													View Trash
												</button>
												<button
													onClick={() => navigate("/admin/other-payment/add")}
													className='bg-[#003E32] text-white '>
													<Icons.ADD className='text-lg text-white' />
													Add New
												</button>
												<div className='flex justify-end'>
													<Whisper placement='leftStart' enterable
														speaker={<Popover full>
															<div className='download__menu' onClick={() => exportTable('print')} >
																<Icons.PRINTER className='text-[16px]' />
																Print Table
															</div>
															<div className='download__menu' onClick={() => exportTable('copy')}>
																<Icons.COPY className='text-[16px]' />
																Copy Table
															</div>
															<div className='download__menu' onClick={() => exportTable('pdf')}>
																<Icons.PDF className="text-[16px]" />
																Download Pdf
															</div>
															<div className='download__menu' onClick={() => exportTable('excel')} >
																<Icons.EXCEL className='text-[16px]' />
																Download Excel
															</div>
														</Popover>}
													>
														<div className='record__download' >
															<Icons.MORE />
														</div>
													</Whisper>
												</div>
											</div>
										</div>
									</div>

									{/* Table start */}
									<div className='overflow-x-auto list__table list__table__checkin'>
										<table className='min-w-full bg-white' id='table' ref={tableRef}>
											<thead className='bg-gray-100 list__table__head'>
												<tr>
													<td align='center' className='w-[5%]'>
														<input type='checkbox'
															onChange={selectAll}
															checked={data.length > 0 && selected.length === data.length}
														/>
													</td>
													<td>Hotel</td>
													<td className='w-[8%]'>Date</td>
													<td className='w-[10%]'>Amount</td>
													<td className='w-[10%]'>Purpose</td>
													<td className='w-[14%]'>Status</td>
													<td className='w-[14%]'>Ref. ID</td>
													<td>Transaction ID</td>
													<td>Receipt No</td>
													<td align='center' className='w-[5%]'>Action</td>
												</tr>
											</thead>
											<tbody>
												{
													data?.map((d, i) => {
														return <tr key={i} className='hover:bg-gray-100'>
															<td align='center'>
																<input type='checkbox' checked={selected.includes(d._id)} onChange={() => handleCheckboxChange(d._id)} />
															</td>
															<td>
																{d.other_payment_hotel_id.hotel_name}
															</td>
															<td>{d.other_payment_payment_date}</td>
															<td>{d.other_payment_amount}</td>
															<td>{d.other_payment_purpose}</td>
															<td>
																{
																	d.other_payment_payment_init === "1" ? (d.other_payment_payment_status == "0" ?
																		<span className='chip chip__red'>Failed</span> :
																		(d.other_payment_payment_status == "1" ?
																			<span className='chip chip__green'>Success</span> :
																			<span className='chip chip__yellow'>Processing</span>)) :
																		<span className='chip chip__grey'>Payment Not initiated</span>

																}
															</td>
															<td>{d.other_payment_payment_ref_no}</td>
															<td>{d.other_payment_payment_transaction_id}</td>
															<td>{d.other_payment_receipt_number}</td>

															<td className='px-4 text-center'>
																<Whisper
																	placement='leftStart'
																	trigger={"click"}
																	onClick={(e) => e.stopPropagation()}
																	speaker={<Popover full>
																		<div
																			className='table__list__action__icon'
																			onClick={(e) => {
																				e.stopPropagation()
																				navigate("/admin/other-payment/edit/" + d._id)
																			}}
																		>
																			<Icons.EDIT className='text-[16px]' />
																			Edit
																		</div>
																		<div
																			className='table__list__action__icon'
																			onClick={(e) => {
																				e.stopPropagation()
																				deleteData(d._id, "other-payments");
																			}}
																		>
																			<Icons.DELETE className='text-[16px]' />
																			Delete
																		</div>
																		<div
																			className='table__list__action__icon'
																			onClick={(e) => {
																				e.stopPropagation()
																				deleteData(d._id, "other-payments", true);
																			}}
																		>
																			<Icons.DELETE className='text-[16px]' />
																			Trash
																		</div>
																		{d.other_payment_receipt_number && <div
																			className='table__list__action__icon'
																			onClick={(e) => {
																				e.stopPropagation()
																				navigate(`/admin/payment-receipt/other/${d._id}`, {
																					state: { payment: true }
																				})
																			}}
																		>
																			<Icons.PRINTER className='text-[16px]' />
																			Print Receipt
																		</div>}
																	</Popover>}
																>
																	<div className='table__list__action' >
																		<Icons.HORIZONTAL_MORE />
																	</div>
																</Whisper>
															</td>

														</tr>
													})
												}
											</tbody>
											{
												data.length >= 1 && (
													<tfoot>
														<tr>
															<td colSpan={3} align='right' className='font-semibold'>
																Total Amount
															</td>
															<td className='font-semibold'>{totalAmount}</td>
														</tr>
													</tfoot>
												)
											}
										</table>
										{data.length < 1 && <NoData />}
									</div>
									{data.length > 0 && <div className='paginate__parent'>
										<p>Showing {data.length} of {totalData} entries</p>
										<Pagination
											activePage={activePage}
											totalData={totalData}
											dataLimit={dataLimit}
											setActivePage={setActivePage}
										/>
									</div>}
								</div>
							</>
						)
							: <DataShimmer />
					}
				</div>
			</main>
		</>
	)
}

export default OtherPaymentList;