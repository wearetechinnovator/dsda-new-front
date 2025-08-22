import React, { useCallback, useEffect, useState } from 'react';
import { SelectPicker, DatePicker, Button } from 'rsuite';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCurrencyRupee, MdOutlineAdd } from "react-icons/md";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import useMyToaster from '../../hooks/useMyToaster';
import useApi from '../../hooks/useApi';
import useBillPrefix from '../../hooks/useBillPrefix';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from '../../store/partyModalSlice';
import { toggle as itemToggle } from '../../store/itemModalSlice';
import swal from 'sweetalert';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import AddPartyModal from '../../components/AddPartyModal';
import AddItemModal from '../../components/AddItemModal';
import MySelect2 from '../../components/MySelect2';
import { Icons } from '../../helper/icons';



document.title = "Purchase Invoice";
const PurchaseInvoice = ({ mode }) => {
  const toast = useMyToaster();
  const { id } = useParams()
  const getBillPrefix = useBillPrefix("invoice");
  const { getApiData } = useApi();
  const getPartyModalState = useSelector((store) => store.partyModalSlice.show);
  const getItemModalState = useSelector((store) => store.itemModalSlice.show);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemRowSet = {
    rowItem: 1, itemName: '', description: '', hsn: '', qun: '1', itemId: '',
    unit: [], selectedUnit: "", price: '', discountPerAmount: '', discountPerPercentage: '',
    tax: '', taxAmount: '', amount: '', perDiscountType: "", //for checking purpose only
  }
  const additionalRowSet = {
    additionalRowsItem: 1, particular: '', amount: ''
  }
  const [ItemRows, setItemRows] = useState([itemRowSet]);
  const [additionalRows, setAdditionalRow] = useState([additionalRowSet]); //{ additionalRowsItem: 1 }
  const [formData, setFormData] = useState({
    party: '', purchaseInvoiceNumber: '', originalInvoiceNumber: '', invoiceDate: new Date().toISOString().split('T')[0],
    validDate: '', items: ItemRows, additionalCharge: additionalRows, note: '', terms: '',
    discountType: '', discountAmount: '', discountPercentage: '', paymentStatus: '0', finalAmount: '',
  })

  const [perPrice, setPerPrice] = useState(null);
  const [perTax, setPerTax] = useState(null);
  const [perDiscount, setPerDiscount] = useState(null);
  const [perQun, setPerQun] = useState(null)

  // When change discount type;
  const [discountToggler, setDiscountToggler] = useState(true);

  // Store all items without filter
  const [items, setItems] = useState([]);
  // Store units
  const [unit, setUnit] = useState([]);
  // Store taxes
  const [tax, setTax] = useState([]);
  // Store party
  const [party, setParty] = useState([]);
  // Account
  const [account, setAccount] = useState([])


  // store label and value pair for dropdown
  const [itemData, setItemData] = useState([])
  const [taxData, setTaxData] = useState([]);



  // Get data for update mode
  useEffect(() => {
    if (id) {
      const get = async () => {
        try {
          let url;
          if (mode === 'edit' || !mode) {
            url = `${process.env.REACT_APP_API_URL}${"/purchaseinvoice/get"}`
          }
          else if (mode === "convert") {
            url = `${process.env.REACT_APP_API_URL}${"/po/get"}`
          }

          const cookie = Cookies.get("token");

          const req = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": 'application/json'
            },
            body: JSON.stringify({ token: cookie, id: id })
          })
          const res = await req.json();
          setFormData({ ...formData, ...res.data });
          setAdditionalRow([...res.data.additionalCharge])
          setItemRows([...res.data.items]);

          if (res.data.discountType != "no") {
            setDiscountToggler(false);
          }
        } catch (error) {
          console.log(error);
          toast("Something went wrong for get data", 'error')
        }
      }

      get();
    }
  }, [id])


  //set Invoice number
  // useEffect(() => {
  //   setFormData({ ...formData, purchaseInvoiceNumber: getBillPrefix });
  // }, [getBillPrefix])


  // Get all data from api
  useState(() => {
    const apiData = async () => {
      {
        const data = await getApiData("item");
        setItems([...data.data]);

        const newItemData = data.data.map(d => ({ label: d.title, value: d.title }));
        setItemData(newItemData);
      }
      {
        const data = await getApiData("unit");
        const unit = data.data.map(d => ({ label: d.title, value: d.title }));
        setUnit([...unit]);
      }
      {
        const data = await getApiData("tax");
        const tax = data.data.map(d => ({ label: d.title, value: d.gst }));
        setTax([...data.data]);
        setTaxData([...tax]);
      }
      {
        const data = await getApiData("party");
        const party = data.data.map(d => ({ label: d.name, value: d._id }));
        setParty([...party]);
      }
      {
        const data = await getApiData("account")
        setAccount([...data.data])
      }
    }

    apiData();

  }, [])





  // When `discount type is before` and apply discount this useEffect run;
  useEffect(() => {
    if (formData.discountType === "before" && ItemRows.length > 0) {
      setItemRows(prevItems =>
        prevItems.map(i => {
          const percentage = ((parseFloat(formData.discountAmount || 0) / parseFloat(i.price || 0) * 100)).toFixed(2);
          const amount = (parseFloat(formData.discountAmount || 0) / parseFloat(prevItems.length)).toFixed(2);
          return {
            ...i,
            discountPerPercentage: percentage,
            discountPerAmount: amount,
          }
        })
      );
    }
  }, [formData.discountAmount, ItemRows.length]);



  // Add item row
  const addItem = (which) => {
    if (which === 1) {
      setItemRows((prevItemRows) => {
        const newItem = {
          ...itemRowSet,
          rowItem: prevItemRows.length > 0 ? prevItemRows[prevItemRows.length - 1].rowItem + 1 : itemRowSet.rowItem,
        };
        const updatedItems = [...prevItemRows, newItem];

        // Update formData after itemRows is updated
        setFormData((prev) => ({
          ...prev,
          items: updatedItems,
        }));

        return updatedItems;
      });
    } else {
      setAdditionalRow((prevAdditionalRows) => {
        const newAdditionalRow = {
          ...additionalRowSet,
          additionalRowsItem: prevAdditionalRows.length > 0 ? prevAdditionalRows[prevAdditionalRows.length - 1].additionalRowsItem + 1 : additionalRowSet.additionalRowsItem,
        };
        const updatedAdditionalRows = [...prevAdditionalRows, newAdditionalRow];

        // Update formData after additionalRows is updated
        setFormData((prev) => ({
          ...prev,
          additionalCharge: updatedAdditionalRows,
        }));

        return updatedAdditionalRows;
      });
    }
  };


  // delete item and additional row
  const deleteItem = (which, ItemId) => {
    if (which === 1) {
      setItemRows((prevItemRows) => {
        const updatedItems = prevItemRows.filter((_, index) => index !== ItemId);

        // Update formData after itemRows is updated
        setFormData((prev) => ({
          ...prev,
          items: updatedItems,
        }));

        return updatedItems;
      });
    } else {
      setAdditionalRow((prevAdditionalRows) => {
        const updatedAdditionalRows = prevAdditionalRows.filter((_, index) => index !== ItemId);

        // Update formData after additionalRows is updated
        setFormData((prev) => ({
          ...prev,
          additionalCharge: updatedAdditionalRows,
        }));

        return updatedAdditionalRows;
      });
    }
  };



  // When change discount type `before` `after` `no`;
  const changeDiscountType = (e) => {
    if (e.target.value !== "no") {
      if (e.target.value === "before") {
        if (ItemRows.some((field) => parseInt(field.discountPerAmount) > 0)) {
          toast("To apply discount before tax, remove discount on item", 'warning')
          return;
        }

      }

      setFormData({ ...formData, discountType: e.target.value });
      setDiscountToggler(false);
    } else {
      setFormData({ ...formData, discountType: e.target.value });
      setFormData((pv) => ({
        ...pv,
        discountAmount: (0).toFixed(2),
        discountPercentage: (0).toFixed(2)
      }))
      setDiscountToggler(true);
    }

  }


  const onPerDiscountAmountChange = (val, index) => {
    let item = [...ItemRows];
    let amount = parseFloat(item[index].price) * parseFloat(item[index].qun);
    let percentage = ((parseFloat(val) / amount) * 100).toFixed(2);

    if (item[index].perDiscountType !== "percentage" || formData.discountType === "before") {
      item[index].discountPerAmount = isNaN(val) || val === 0 ? (0).toFixed(2) : val;
      item[index].discountPerPercentage = isNaN(percentage) ? (0).toFixed(2) : percentage;
    }
    setItemRows(item);

  }


  const onPerDiscountPercentageChange = (val, index) => {
    let item = [...ItemRows];
    let amount = parseFloat(item[index].price) * parseFloat(item[index].qun);
    // let percentage = (parseFloat(val) / amount) * 100;
    let dis_amount = amount / 100 * val

    if (item[index].perDiscountType !== "amount" || formData.discountType === "before") {
      item[index].discountPerPercentage = val;
      item[index].discountPerAmount = (dis_amount).toFixed(2);
    }
    setItemRows(item);

  }


  const onItemChange = (value, index) => {
    let item = [...ItemRows];
    item[index].itemName = value;
    setItemRows(item);

    let selectedItem = items.filter(i => i.title === value);
    if (selectedItem.length >= 0) {
      let item = [...ItemRows];
      let currentUnit = [];
      let taxId = selectedItem[0]?.category?.tax;
      const getTax = tax.filter((t, _) => t._id === taxId)[0];

      item[index].itemId = selectedItem[0]._id;
      item[index].hsn = selectedItem[0]?.category?.hsn;
      item[index].unit = selectedItem[0].unit;
      item[index].selectedUnit = selectedItem[0].unit[0].unit
      item[index].tax = getTax.gst;
      selectedItem[0].unit.forEach((u, _) => {
        currentUnit.push(u.unit);
      })
      item[index].unit = [...currentUnit];

      setItemRows(item);
    }

  }


  const calculatePerTaxAmount = (index) => {
    const tax = ItemRows[index].tax / 100;
    const qun = ItemRows[index].qun;
    const price = ItemRows[index].price;
    const disAmount = ItemRows[index].discountPerAmount;
    const amount = ((qun * price) - disAmount);
    const taxamount = (amount * tax).toFixed(2);

    return taxamount;
  }

  const calculatePerAmount = (index) => {
    const qun = ItemRows[index].qun;
    const price = ItemRows[index].price;
    const disAmount = ItemRows[index].discountPerAmount;
    const totalPerAmount = parseFloat((qun * price) - disAmount) + parseFloat(calculatePerTaxAmount(index));

    return (totalPerAmount).toFixed(2);
  }


  const calculateFinalAmount = () => {
    let totalParticular = 0;
    let total = 0;

    // Total additionla amount and store
    additionalRows.forEach((d, _) => {
      if (d.amount) {
        totalParticular = totalParticular + parseFloat(d.amount);
      }
    })

    if (formData.discountType === "no" || formData.discountType === "" || formData.discountType === "before") {
      total = subTotal()('amount');
    }
    else if (formData.discountType === "after") {
      total = (subTotal()('amount') - formData.discountAmount).toFixed(2);
    }

    return !isNaN(totalParticular) ? (parseFloat(totalParticular) + parseFloat(total)).toFixed(2) : total;

  }

  useEffect(() => {
    const finalAmount = calculateFinalAmount();
    setFormData((prevData) => ({
      ...prevData,
      finalAmount
    }));
  }, [ItemRows, additionalRows]);



  // Return Sub-Total
  /*
    Total Discount.
    Total Tax.
    Total Amount.
  */
  const subTotal = useCallback(() => {
    const subTotal = (which) => {
      let total = 0;

      ItemRows.forEach((item, index) => {
        if (which === "discount") {
          if (item.discountPerAmount) {
            total = (parseFloat(total) + parseFloat(item.discountPerAmount)).toFixed(2)
          }
        }
        else if (which === "tax") {
          total = (parseFloat(total) + parseFloat(calculatePerTaxAmount(index))).toFixed(2);
        }
        else if (which === "amount") {
          total = (parseFloat(total) + parseFloat(calculatePerAmount(index))).toFixed(2);
        }
      })

      return !isNaN(total) ? total : 0.00;

    }
    return subTotal;
  }, [ItemRows, perPrice, perTax, perDiscount, perQun])



  const onDiscountAmountChange = (e) => {
    if (discountToggler !== null) {
      const value = e.target.value || (0).toFixed(2);
      let per = ((value / subTotal()('amount')) * 100).toFixed(2) //Get percentage
      setFormData({ ...formData, discountAmount: e.target.value, discountPercentage: per });
    }

  }


  // *Save bill
  const saveBill = async () => {

    if (formData.party === "") {
      return toast("Please select party", "error")
    } else if (formData.purchaseInvoiceNumber === "") {
      return toast("Please enter purchase invoice number", "error")
    } else if (formData.invoiceDate === "") {
      return toast("Please select invoice date", "error")
    }

    for (let row of ItemRows) {
      if (row.itemName === "") {
        return toast("Please select item", "error")
      } else if (row.qun === "") {
        return toast("Please enter quantity", "error")
      } else if (row.unit === "") {
        return toast("Please select unit", "error")
      } else if (row.price === "") {
        return toast("Please enter price", "error")
      }

    }

    try {
      const url = process.env.REACT_APP_API_URL + "/purchaseinvoice/add";
      const token = Cookies.get("token");

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(!mode || mode !== "edit" ? { ...formData, token } : { ...formData, token, update: true, id: id })
      })
      const res = await req.json();
      if (req.status !== 200 || res.err) {
        return toast(res.err, 'error');
      }

      if (mode === "edit") {
        return toast('Invoice update successfully', 'success');
      }

      clearForm();

      toast('Invoice add successfully', 'success');
      navigate("/admin/purchase-invoice");
      return


    } catch (error) {
      console.log(error);
      return toast('Something went wrong', 'error')
    }

  }


  // *Clear form values;
  const clearForm = () => {
    setItemRows([itemRowSet]);
    setAdditionalRow([additionalRowSet])
    setFormData({
      party: '', purchaseInvoiceNumber: getBillPrefix, invoiceDate: '', validDate: '', items: ItemRows,
      additionalCharge: additionalRows, note: '', terms: '', paymentStatus: '',
      discountType: '', discountAmount: '', discountPercentage: '', originalInvoiceNumber: ''
    });

  }


  return (
    <>
      <Nav title={mode == "edit" ? "Update Purchase Invoice" : "Add Purchase Invoice"} />
      <main id='main'>
        <SideNav />
        <AddPartyModal open={getPartyModalState} />
        <AddItemModal open={getItemModalState} />

        <div className='content__body'>
          <div className='content__body__main bg-white' id='addQuotationTable'>

            <div className='top__btn__grp'>

              <div className='extra__btns'>
                {mode === "edit" && <button onClick={() => {
                  swal({
                    title: "Are you sure?",
                    icon: "warning",
                    buttons: true,
                  })
                    .then((cnv) => {
                      if (cnv) {
                        swal("Invoice successfully duplicate", {
                          icon: "success",
                        });
                        navigate(`/admin/purchase-invoice/add/${id}`)
                      }
                    });
                }}><Icons.COPY />Duplicate invoice</button>}
                <button onClick={saveBill}><Icons.CHECK />{mode ? "Update" : "Save"}</button>
              </div>

            </div>

            <div className='flex flex-col lg:flex-row items-center justify-around gap-4'>
              <div className='flex flex-col gap-2 w-full'>
                <p className='text-xs'>
                  Select Party <span className='required__text'>*</span>
                </p>
                {/* <SelectPicker
                  onChange={(data) => setFormData({ ...formData, party: data })}
                  data={party}
                  value={formData.party?._id}
                /> */}
                <MySelect2
                  model={"party"}
                  onType={(v) => {
                    setFormData({ ...formData, party: v })
                  }}
                  value={formData.party?._id}
                />
              </div>
              <div className='flex flex-col gap-2 w-full lg:w-1/2'>
                <p className='text-xs'>Purchase Invoice Number <span className='required__text'>*</span></p>
                <input type="text"
                  onChange={(e) => setFormData({ ...formData, purchaseInvoiceNumber: e.target.value })}
                  value={formData.purchaseInvoiceNumber}
                />
              </div>
              <div className='flex flex-col gap-2 w-full lg:w-1/2'>
                <p className='text-xs'>Original Invoice Number <span className='required__text'>*</span></p>
                <input type="text"
                  onChange={(e) => setFormData({ ...formData, originalInvoiceNumber: e.target.value })}
                  value={formData.originalInvoiceNumber}
                />
              </div>
              <div className='flex flex-col gap-2 w-full lg:w-1/2'>
                <p className='text-xs'>Invoice Date <span className='required__text'>*</span></p>
                <input type="date"
                  className='text-xs'
                  onChange={(e) => {
                    setFormData({ ...formData, invoiceDate: e.target.value })
                  }}
                  value={formData.invoiceDate}
                />
              </div>
              <div className='flex flex-col gap-2 w-full lg:w-1/2'>
                <p className='text-xs'>Due Date</p>
                <input type="date"
                  className='text-xs'
                  onChange={(e) => {
                    setFormData({ ...formData, validDate: e.target.value })
                  }}
                  value={formData.validDate}
                />
              </div>
            </div>

            <div className='overflow-x-auto rounded'>
              <table className='add__table min-w-full table-style'>
                <thead >
                  <tr>
                    <th style={{ "width": "*" }}>Item</th>
                    <th style={{ "width": "6%" }}>HSN/SAC</th>
                    <th style={{ "width": "5%" }}>QTY</th>
                    <th style={{ "width": "7%" }}>Unit</th>
                    <th style={{ "width": "10%" }}>Price/Item</th>
                    <th style={{ "width": "10%" }}>Discount</th>
                    <th style={{ "width": "10%" }}>Tax</th>
                    <th style={{ "width": "10%" }}>Amount</th>
                    <th style={{ "width": "3%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {ItemRows.map((i, index) => (
                    <tr key={i.rowItem} className='border-b'>

                      {/* Item name and description */}
                      <td>
                        <div className='flex flex-col gap-2'>
                          {/* <SelectPicker
                            onChange={(v) => onItemChange(v, index)}
                            value={ItemRows[index].itemName}
                            data={itemData}
                          /> */}
                          <MySelect2
                            model={"item"}
                            onType={(v) => onItemChange(v, index)}
                            value={ItemRows[index].itemName}
                          />
                          <input type='text' className='input-style' placeholder='Description'
                            onChange={(e) => {
                              let item = [...ItemRows];
                              item[index].description = e.target.value;
                              setItemRows(item);
                            }}
                            value={ItemRows[index].description}
                          />
                        </div>
                      </td>
                      <td>
                        <input type='text' className='w-[70px] input-style'
                          onChange={(e) => {
                            let item = [...ItemRows];
                            item[index].hsn = e.target.value;
                            setItemRows(item);
                          }}
                          value={ItemRows[index].hsn}
                        />
                      </td>
                      <td>
                        <input type='text' className='input-style'
                          onChange={(e) => {
                            let item = [...ItemRows];
                            item[index].qun = e.target.value;
                            setItemRows(item);
                            setPerQun(e.target.value);
                            if (formData.discountType !== "before") {
                            }
                            onPerDiscountPercentageChange(formData.items[index].discountPerPercentage, index);
                            onPerDiscountAmountChange(formData.items[index].discountPerAmount, index);
                          }}
                          value={ItemRows[index].qun}
                        />
                      </td>
                      <td>
                        <select className='input-style'
                          onChange={(e) => {
                            let item = [...ItemRows];
                            item[index].selectedUnit = e.target.value;
                            setItemRows(item);
                          }}
                          value={ItemRows[index].selectedUnit}
                        >
                          {
                            ItemRows[index].unit.map((u, _) => {
                              return <option key={_} value={u}>{u}</option>
                            })
                          }
                        </select>
                      </td>
                      <td align='center'>
                        <div>
                          <input type='text' className='input-style'
                            onChange={(e) => {
                              let item = [...ItemRows];
                              item[index].price = e.target.value;
                              setItemRows(item);
                              setPerPrice(e.target.value);
                              if (formData.discountType !== "before") {
                              }
                              onPerDiscountPercentageChange(formData.items[index].discountPerPercentage, index);
                              onPerDiscountAmountChange(formData.items[index].discountPerAmount, index);
                            }}
                            value={ItemRows[index].price}
                          />
                        </div>
                      </td>
                      <td> {/** Discount amount and percentage */}
                        <div className={`w-[100px] flex flex-col gap-2 items-center`} >
                          <div className='add-table-discount-input'>
                            <input type="text"
                              className={`${formData.discountType === 'before' ? 'bg-gray-100' : ''} `}
                              onChange={formData.discountType !== 'before' ? (e) => {
                                let form = { ...formData };
                                form.items[index].perDiscountType = 'amount';
                                setFormData({ ...form });
                                onPerDiscountAmountChange(e.target.value, index)
                              } : null}
                              value={ItemRows[index].discountPerAmount}
                            // value={calculatePerDiscountAmount(index)}
                            />
                            <div><MdCurrencyRupee /></div>
                          </div>
                          <div className='add-table-discount-input' >
                            <input type="text"
                              className={`${formData.discountType === 'before' ? 'bg-gray-100' : ''} `}
                              onChange={formData.discountType !== 'before' ? (e) => {
                                let form = { ...formData };
                                form.items[index].perDiscountType = 'percentage';
                                setFormData({ ...form });
                                onPerDiscountPercentageChange(e.target.value, index)
                              } : null}
                              value={ItemRows[index].discountPerPercentage}
                            // value={calculatePerDiscountPercentage(index)}
                            />
                            <div>%</div>
                          </div>
                        </div>
                      </td>
                      <td> {/** Tax and Taxamount */}
                        <div className='flex flex-col gap-2'>
                          <SelectPicker
                            onChange={(v) => {
                              let item = [...ItemRows];
                              item[index].tax = v;
                              setItemRows(item);
                              setPerTax('')
                            }}
                            value={ItemRows[index].tax}
                            data={taxData}
                          />
                          <input type="text"
                            onChange={(e) => {
                              let item = [...ItemRows];
                              item[index].taxAmount = e.target.value;
                              setItemRows(item);
                            }}
                            value={calculatePerTaxAmount(index)}
                          />
                        </div>
                      </td>
                      <td align='center'>
                        <div>
                          <input type="text"
                            value={calculatePerAmount(index)}
                            className='bg-gray-100 custom-disabled'
                            disabled
                          />
                        </div>
                      </td>
                      <td align='center' className='w-[20px]'>
                        <RiDeleteBin6Line
                          className='cursor-pointer text-[16px]'
                          onClick={() => ItemRows.length > 1 && deleteItem(1, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={9}>
                      <Button color='blue' className='float-right w-full font-bold' onClick={() => addItem(1)}>
                        <MdOutlinePlaylistAdd className='text-lg mr-1' />
                        Add Item
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} align='right'>
                      <p className='py-2 font-bold'>Sub-Total</p>
                    </td>
                    <td>{subTotal()('discount')}</td>
                    <td>{subTotal()('tax')}</td>
                    <td>{subTotal()('amount')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {/* --------- Tax amount table ------- */}
            <div className='overflow-x-auto rounded' id='taxAmountTable'>
              <table className='table-style w-full'>
                <thead>
                  <tr>
                    <td className='font-bold'>Total Taxable Amount</td>
                    <td className='font-bold'>Total Tax Amount</td>
                    <td>
                      <span className='font-bold mr-1'>Discount Type</span>
                      <span>(Additional)</span>
                    </td>
                    <td>
                      <span className='font-bold mr-1'>Discount Amount</span>
                      <span>(Additional)</span>
                    </td>
                    <td>
                      <span className='font-bold mr-1'>Discount Percentage</span>
                      <span>(Additional)</span>
                    </td>
                    <td className='font-bold'>Total Amount</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='min-w-[150px]'>
                      <input type="text" name="total_taxable_amount"
                        value={(subTotal()('amount') - subTotal()('tax')).toFixed(2)}
                        className='bg-gray-100 custom-disabled'
                        disabled
                      />
                    </td>
                    <td className='min-w-[150px]'>
                      <input type="text" name='total_tax_amount'
                        value={subTotal()('tax')}
                        className='bg-gray-100 custom-disabled'
                        disabled
                      />
                    </td>
                    <td className='min-w-[180px]'>
                      <select name="discount_type" value={formData.discountType} onChange={changeDiscountType}>
                        <option value="no">No Discount</option>
                        <option value="before">Before Tax</option>
                        <option value="after">After Tax</option>
                      </select>
                    </td>

                    <td className='min-w-[180px]'>
                      <div className='add-table-discount-input' >
                        <input
                          id='discountAmount'
                          type="text"
                          className={`${discountToggler ? 'bg-gray-100 custom-disabled' : ''}`}
                          disabled={discountToggler ? true : false}
                          onChange={(e) => discountToggler ? null : onDiscountAmountChange(e)}
                          value={formData.discountAmount}
                        />
                        <div><MdCurrencyRupee /></div>
                      </div>
                    </td>
                    <td className='min-w-[200px]'>
                      <div className='add-table-discount-input'>
                        <input
                          type="text"
                          id='discountPercentage'
                          className={`${discountToggler ? 'bg-gray-100 custom-disabled' : ''}`}
                          disabled={discountToggler ? true : false}
                          onChange={discountToggler ? null : (e) => {
                            let amount = ((subTotal()('amount') / 100) * e.target.value).toFixed(2);
                            setFormData({
                              ...formData, discountPercentage: e.target.value, discountAmount: amount,
                            })

                            if (formData.discountType === "before") {
                              let items = [...ItemRows];
                              items.forEach((i, _) => {
                                // i.discountPerAmount = amount / parseFloat(items.length);
                                i.discountPerPercentage = e.target.value;
                              })

                              setItemRows([...items]);
                            }
                          }}
                          value={formData.discountPercentage}
                        />
                        <div>%</div>
                      </div>
                    </td>
                    <td className='min-w-[150px]'>
                      <input type="text" name="total_amount"
                        className='bg-gray-100 custom-disabled'
                        disabled
                        value={subTotal()('amount')}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* ------- Note and Additional charges ------- */}
            <div className='w-full flex flex-col lg:flex-row justify-between gap-4 mt-3'>
              <div className='flex flex-col w-full gap-3'>
                <div>
                  <p>Note: </p>
                  <input type="text"
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    value={formData.note}
                  />
                </div>
                <div>
                  <p>Terms:</p>
                  <input type="text"
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    value={formData.terms}
                  />
                </div>
                <div>
                  <p>Payment Status:</p>
                  <select name="" id=""
                    onChange={(e) => {
                      setFormData({ ...formData, paymentStatus: e.target.value })
                    }}
                    value={formData.paymentStatus}
                  >
                    <option value="0">Not Paid</option>
                    <option value="1">Paid</option>
                  </select>
                </div>
                <div>
                  <p>Select Account:</p>
                  <select
                    onChange={(e) => {
                      setFormData({ ...formData, paymentAccount: e.target.value })
                    }}
                    value={formData.paymentAccount}
                  >
                    <option value="">--Select Account--</option>
                    {
                      account.map((a, _) => {
                        return <option value={a._id} key={_}>{a.title}</option>
                      })
                    }
                  </select>
                </div>
              </div>
              <div className='w-full'>
                <div className='uppercase font-bold border border-dashed p-2 rounded'>
                  Additional Charges
                </div>
                <div className='overflow-x-auto rounded mt-3' id='addtionalChargeTable'>
                  <table className='table-style w-full'>
                    <thead className='bg-gray-100'>
                      <tr>
                        <td>Particular</td>
                        <td>Amount</td>
                        <td>Actions</td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        additionalRows.map((i, index) => (
                          <tr key={i.additionalRowsItem}>
                            <td>
                              <input type="text"
                                onChange={(e) => {
                                  let item = [...additionalRows];
                                  item[index].particular = e.target.value;
                                  setAdditionalRow(item);
                                }}
                                value={additionalRows[index].particular}
                              />
                            </td>
                            <td>
                              <input type="text"
                                onChange={(e) => {
                                  let item = [...additionalRows];
                                  item[index].amount = e.target.value;
                                  setAdditionalRow(item);
                                }}
                                value={additionalRows[index].amount}
                              />
                            </td>
                            <td align='center'>
                              <RiDeleteBin6Line
                                className='cursor-pointer text-lg'
                                onClick={() => deleteItem(2, index)}
                              />
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}>
                          <Button color='blue' className='float-right w-full font-bold' onClick={() => addItem(2)}>
                            <MdOutlinePlaylistAdd className='text-lg mr-1' />
                            Add Item
                          </Button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <p className='font-bold mt-4 mb-2'>Final Amount</p>
                <input type="text" name="final_amount"
                  value={calculateFinalAmount()}
                  className='bg-gray-100 custom-disabled w-full'
                  disabled
                />
              </div>
            </div>

            <div className='w-full flex justify-center gap-3 my-3 mt-5'>
              <button
                onClick={saveBill}
                className='add-bill-btn'>
                <FaRegCheckCircle />
                {!mode || mode === "convert" ? "Save" : "Update"}
              </button>
              <button className='reset-bill-btn' onClick={clearForm}>
                <BiReset />
                Reset
              </button>
            </div>

          </div>
          {/* Content Body Main Close */}
        </div>
        {/* Content Body Close */}
      </main>
    </>
  )
}

export default PurchaseInvoice;
