import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../../../components/Admin/Nav';
import SideNav from '../../../../components/Admin/SideNav';
import { useNavigate } from 'react-router-dom';
import useExportTable from '../../../../hooks/useExportTable';
import useMyToaster from '../../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import downloadPdf from '../../../../helper/downloadPdf';
import DataShimmer from '../../../../components/Admin/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, Whisper } from 'rsuite';
import { Icons } from '../../../../helper/icons';
import Pagination from '../../../../components/Admin/Pagination';
import useApi from '../../../../hooks/useApi';
import useSetTableFilter from '../../../../hooks/useSetTableFilter';
import NoData from '../../../../components/Admin/NoData';




const Block = () => {
	const toast = useMyToaster();
	const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
	const { getFilterState, setFilterState } = useSetTableFilter();
	const savedFilter = getFilterState("block");
	const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
	const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
	const [totalData, setTotalData] = useState()
	const [selected, setSelected] = useState([]);
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const tableRef = useRef(null);
	const exportData = useMemo(() => {
		return data && data.map(({ name }, _) => ({
			Name: name,
		}));
	}, [data]);
	const [loading, setLoading] = useState(true);
	const { deleteData, restoreData } = useApi()
	const [isTrash, setIsTrash] = useState(false);
	const timeRef = useRef(null);
	const [searchTxt, setSearchTxt] = useState('');



	// Get data;
	const get = async (searchValue = searchTxt) => {
		setLoading(true);
		try {
			const data = {
				token: Cookies.get("token"),
				trash: isTrash,
				page: activePage,
				limit: dataLimit
			}
			if (searchValue) data.search = searchValue;
			setFilterState("block", dataLimit, activePage);
			const url = process.env.REACT_APP_MASTER_API + `/block/get`;
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
			setLoading(false);
		}
	}
	useEffect(() => {
		get();
	}, [isTrash, dataLimit, activePage])

	const searchTableDatabase = (e) => {
		const txt = e.target.value;
		setSearchTxt(txt);

		if (timeRef.current) clearTimeout(timeRef.current);

		timeRef.current = setTimeout(async () => {
			await get(txt);
		}, 500)

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


	const exportTable = async (whichType) => {
		if (whichType === "copy") {
			copyTable("table"); // Pass tableid
		}
		else if (whichType === "excel") {
			downloadExcel(exportData, 'block-list.xlsx') // Pass data and filename
		}
		else if (whichType === "print") {
			printTable(tableRef, "Block List"); // Pass table ref and title
		}
		else if (whichType === "pdf") {
			let document = exportPdf('Block List', exportData);
			downloadPdf(document)
		}
	}


	return (
		<>
			<Nav title={"Block Table"} />
			<main id='main'>
				<SideNav />
				<Tooltip id='itemTooltip' />
				<div className='content__body'>
					{loading === false ?
						<div className='content__body__main'>
							<div className={`add_new_compnent`}>
								<div className='flex flex-col md:flex-row justify-between items-center'>
									<div>
										<select value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
											{
												[5, 10, 50, 100, 500, 1000, 5000, 10000, 50000].map((n, i) => {
													return <option value={n} key={i}>{n}</option>
												})
											}
											<option value={totalData}>All</option>
										</select>
									</div>
									<div className='flex flex-col md:flex-row items-center gap-2'>
										<div className='flex w-full flex-col lg:w-[300px]'>
											<input type='text'
												placeholder='Search...'
												value={searchTxt}
												onChange={searchTableDatabase}
												className='p-[6px]'
											/>
										</div>
										{!isTrash && <button
											onClick={() => deleteData(selected, "block", true)}
											className={`${selected.length > 0 ? 'bg-red-400 text-white' : 'bg-gray-100'}`}>
											<Icons.DELETE className='text-lg' />
											Trash
										</button>}
										{
											isTrash && <button
												onClick={() => restoreData(selected, "block")}
												className={`${selected.length > 0 ? 'bg-[#003E32] text-white' : 'bg-gray-100'}`}>
												<Icons.RESTORE className='text-lg' />
												Restore
											</button>
										}
										<button
											onClick={() => deleteData(selected, "block")}
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
											onClick={() => navigate("/admin/block/add")}
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
							<div className='overflow-x-auto list__table'>
								<table className='min-w-full bg-white' id='table' ref={tableRef}>
									<thead className='bg-gray-100 list__table__head'>
										<tr>
											<td className='w-[50px]' align='center'>
												<input type='checkbox' onChange={selectAll} checked={data.length > 0 && selected.length === data.length} />
											</td>
											<td>Name</td>
											<td align='center'>Action</td>
										</tr>
									</thead>
									<tbody>
										{
											data?.map((d, i) => {
												return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
													<td align='center'>
														<input type='checkbox' checked={selected.includes(d._id)} onChange={() => handleCheckboxChange(d._id)} />
													</td>
													<td>{d.name}</td>
													<td align='center'>
														<Whisper
															placement='leftStart'
															trigger={"click"}
															onClick={(e) => e.stopPropagation()}
															speaker={<Popover full>
																<div
																	className='table__list__action__icon'
																	onClick={(e) => {
																		e.stopPropagation()
																		navigate("/admin/block/edit/" + d._id)
																	}}
																>
																	<Icons.EDIT className='text-[16px]' />
																	Edit
																</div>
																<div
																	className='table__list__action__icon'
																	onClick={(e) => {
																		e.stopPropagation()
																		deleteData(d._id, "block");
																	}}
																>
																	<Icons.DELETE className='text-[16px]' />
																	Delete
																</div>
																<div
																	className='table__list__action__icon'
																	onClick={(e) => {
																		e.stopPropagation()
																		deleteData(d._id, "block", true);
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
								{data.length < 1 && <NoData />}
							</div>
							{data.length > 0 && <div className='paginate__parent'>
								<p>Showing {data.length} of {totalData} entries</p>
								<Pagination
									activePage={activePage}
									setActivePage={setActivePage}
									totalData={totalData}
									dataLimit={dataLimit}
								/>
							</div>}
						</div>
						: <DataShimmer />
					}
				</div>
			</main >
		</>
	)
}

export default Block;