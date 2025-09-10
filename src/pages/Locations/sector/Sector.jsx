import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../../components/Nav';
import SideNav from '../../../components/SideNav';
import { useNavigate } from 'react-router-dom';
import useExportTable from '../../../hooks/useExportTable';
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import downloadPdf from '../../../helper/downloadPdf';
import DataShimmer from '../../../components/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, Whisper } from 'rsuite';
import { Icons } from '../../../helper/icons';
import Pagination from '../../../components/Pagination';
import useSearchTable from '../../../hooks/useSearchTable';
import useApi from '../../../hooks/useApi';


document.title = "Sector"
const Sector = ({ mode }) => {
	const toast = useMyToaster();
	const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
	const [activePage, setActivePage] = useState(1);
	const [dataLimit, setDataLimit] = useState(10);
	const [totalData, setTotalData] = useState()
	const [selected, setSelected] = useState([]);
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const tableRef = useRef(null);
	const exportData = useMemo(() => {
		return data && data.map(({ name }, _) => ({
			Name: name
		}));
	}, [data]);
	const [loading, setLoading] = useState(true);
	const searchTable = useSearchTable();
	const { deleteData, restoreData } = useApi()
	const [isTrash, setIsTrash] = useState(false);



	// Get data;
	useEffect(() => {
		const get = async () => {
			try {
				const data = {
					token: Cookies.get("token"),
					trash: isTrash,
					page: activePage,
					limit: dataLimit
				}
				const url = process.env.REACT_APP_MASTER_API + `/sector/get`;
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

			} catch (error) {
				console.log(error)
			}
		}
		get();
	}, [isTrash, dataLimit, activePage])


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


	const exportTable = async (whichType) => {
		if (whichType === "copy") {
			copyTable("table"); // Pass tableid
		}
		else if (whichType === "excel") {
			downloadExcel(exportData, 'sector-list.xlsx') // Pass data and filename
		}
		else if (whichType === "print") {
			printTable(tableRef, "Sector List"); // Pass table ref and title
		}
		else if (whichType === "pdf") {
			let document = exportPdf('Sector List', exportData);
			downloadPdf(document)
		}
	}


	return (
		<>
			<Nav title={"Sector Table"} />
			<main id='main'>
				<SideNav />
				<Tooltip id='itemTooltip' />
				<div className='content__body'>
					<div
						className={`mb-5 w-full bg-white rounded p-4 shadow-sm add_new_compnent overflow-hidden
							transition-all
						`}>
						<div className='flex justify-between items-center'>
							<div className='flex flex-col'>
								<select value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
									<option value={100}>100</option>
								</select>
							</div>
							<div className='flex items-center gap-2'>
								<div className='flex w-full flex-col lg:w-[300px]'>
									<input type='text'
										placeholder='Search...'
										onChange={searchTable}
										className='p-[6px]'
									/>
								</div>
								{!isTrash && <button
									onClick={() => deleteData(selected, "sector", true)}
									className={`${selected.length > 0 ? 'bg-red-400 text-white' : 'bg-gray-100'}`}>
									<Icons.DELETE className='text-lg' />
									Trash
								</button>}
								{
									isTrash && <button
										onClick={() => restoreData(selected, "sector")}
										className={`${selected.length > 0 ? 'bg-[#003E32] text-white' : 'bg-gray-100'}`}>
										<Icons.RESTORE className='text-lg' />
										Restore
									</button>
								}
								<button
									onClick={() => deleteData(selected, 'sector')}
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
									onClick={() => navigate("/admin/sector/add")}
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

						<div id='itemFilter'>
						</div>
					</div>
					{
						<div className='content__body__main'>
							{/* Table start */}
							<div className='overflow-x-auto list__table'>
								<table className='min-w-full bg-white' id='table' ref={tableRef}>
									<thead className='bg-gray-100 list__table__head'>
										<tr>
											<th className='py-2 px-4 border-b w-[50px]'>
												<input type='checkbox' onChange={selectAll} checked={data.length > 0 && selected.length === data.length} />
											</th>
											<td className='py-2 px-4 border-b '>Name</td>
											<th className='py-2 px-4 border-b w-[100px]'>Action</th>
										</tr>
									</thead>
									<tbody>
										{
											data.map((d, i) => {
												return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
													<td className='py-2 px-4 border-b max-w-[10px]'>
														<input type='checkbox' checked={selected.includes(d._id)} onChange={() => handleCheckboxChange(d._id)} />
													</td>
													<td className='px-4 border-b'>{d.name}</td>

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
																		navigate("/admin/sector/edit/" + d._id)
																	}}
																>
																	<Icons.EDIT className='text-[16px]' />
																	Edit
																</div>
																<div
																	className='table__list__action__icon'
																	onClick={(e) => {
																		e.stopPropagation()
																		deleteData(d._id, "sector");
																	}}
																>
																	<Icons.DELETE className='text-[16px]' />
																	Delete
																</div>
																<div
																	className='table__list__action__icon'
																	onClick={(e) => {
																		e.stopPropagation()
																		deleteData(d._id, "sector", true);
																	}}
																>
																	<Icons.DELETE className='text-[16px]' />
																	Trash
																</div>
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
								</table>
								<div className='paginate__parent'>
									<p>Showing {data.length} of {totalData} entries</p>
									<Pagination
										activePage={activePage}
										totalData={totalData}
										dataLimit={dataLimit}
										setActivePage={setActivePage}
									/>
								</div>
							</div>
						</div>
						// : <AddNew title={"Item"} link={"/admin/item/add"} />
						// : <DataShimmer />
					}
				</div>
			</main>
		</>
	)
}

export default Sector;