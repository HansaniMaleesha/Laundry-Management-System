
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Dropdown ,FormControl} from 'react-bootstrap';
import companyLogo from '../../images/logo.png'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ViewBills = () => {

  //-----------------------Invoice numbers dropdown---------------------------------------------
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [filter, setFilter] = useState('');

  
  const filteredInvoiceNumbers = invoiceNumbers.filter(item => String(item.id).includes(filter));

  //--------------------------Mobile numbers dropdown------------------------------------------
  const [mobileNumbers, setMobileNumbers] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

 

  const handleMobileSelection = (selectedMobile) => {
    setSelectedMobile(selectedMobile);

    const selectedMobileObject = mobileNumbers.find(item => item.mobile === selectedMobile);
    if (selectedMobileObject) {
      setSelectedCustomerId(selectedMobileObject.id);
      filterData(invoiceId, selectedMobileObject.id);
    }
  };

  const handleFilterChange = (e) => {
    const searchText = e.target.value;
    setFilterText(searchText);

    const filtered = mobileNumbers.filter((option) =>
      option.mobile.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredOptions(filtered);
  };

  const handleOptionSelect = (option) => {
    handleMobileSelection(option.mobile);
  };

 //----------------------------------------------------------------------------------------------------




  const [data, setData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [invoiceId, setInvoiceId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const[invoiceIds,setInvoiceIds] = useState([]);
  

  useEffect(() => {
    axios.get('http://localhost:8000/bill/getAllBills', {
      withCredentials: true,
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    axios.get('http://localhost:8000/bill/getAllMobileNumbers', {
      withCredentials: true,
    })
      .then(response => {
        setMobileNumbers(response.data);
        setFilteredOptions(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    axios.get('http://localhost:8000/bill/getAllInvoiceNumbers', {
      withCredentials: true,
    })
      .then(response => {
        setInvoiceIds(response.data);
        setInvoiceNumbers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },[selectedRows]);

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, id]);
      console.log(selectedRows);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleDelete = () => {
   
    axios.post('http://localhost:8000/bill/delete', {
      billIDs: selectedRows
    },{withCredentials: true}).then(response => {
      console.log(response.data);
      toast.success('Customer deleted successfully');
      setTimeout(() => {
        window.location.reload(true);
      }, 5000);
    }).catch(error => {
      console.log(error);
      toast.error('Error');
    })
    setSelectedRows([]);
  };



  const filterData = (invoice_id, customer_id) => {
    axios.post('http://localhost:8000/bill/getAllByInvoiceAndMobile', {
      invoice_id,
      customer_id
    }, {
      withCredentials: true,
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

//-------------------------------------------Logout handle---------------------------------------

  const handleLogout = () => {
    console.log('Attempting to remove cookie...');
    document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ';
    console.log('Cookie removed');
    window.location.href = '/login';
  };

  //must replace--------------------------

  

  return (

    <div className="container-fluid" style={{ maxWidth: '800px', marginTop:'20px'}}> 

  {/* //----------------------------------Header----------------------------------------------------------------------------------------// */}
      <div className="row  mb-5" style={{alignItems:'center',marginInlineStart:'150px'}}>
        <div className="col-md-auto mb-3 mb-md-0">
          <img src={companyLogo} alt="Company Logo" style={{ width: '100px' }} />
        </div>
        <div className="col-md">
          <h2 style={{fontStyle: 'italic', fontWeight: 800}}>Dirty 2 Beauty Laundry</h2>
        </div>
      </div>


    {/**--------------------------------- Invoice Drop down---------------------------------------------------------------------------------- */}
    <div className="mb-3" style={{ marginBottom: '200px' }}>
      <div className='row gx-2'>
        <div className="col-md-6">
          <div className='row gx-2'>
            <div className="col-md-6">

            
      {/* <Form.Group controlId="formInvoice"> */}
        
        <Dropdown>
          <Dropdown.Toggle className="custom-dropdown-btn" variant="primary" id="dropdown-basic">
            {selectedInvoice || 'Select Invoice'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form.Control
              type="text"
              placeholder="Filter by Invoice Number"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filteredInvoiceNumbers.map(item => (
              <Dropdown.Item
                key={item.id}
                onClick={() => {
                  setSelectedInvoice(item.id);
                  filterData(item.id, selectedCustomerId);
                }}
              >
                {item.id}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      

            </div>
          </div> 
        </div>
        <div className="col-md-6">
          <div className='row gx-2'>
    
            <div className="col-md-6">

            <div>
        {error && <p>Error: {error}</p>}
        <Dropdown >
          <Dropdown.Toggle className="custom-dropdown-btn" variant="success" id="dropdown-basic">
            {selectedMobile ? selectedMobile : 'Select Mobile Number'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <FormControl
              autoFocus
              className="mx-3 my-2 w-auto"
              placeholder="Type to filter"
              onChange={handleFilterChange}
              value={filterText}
            />
            {filteredOptions.map((number, index) => (
              <Dropdown.Item key={index} onClick={() => handleOptionSelect(number)}>
                {number.mobile}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      

             </div>
          </div> 
        </div>
  </div>
</div>
    {/**-----------------------------View Bills---------------------------------------------------------------------------------------- */}
      
      <div style={{ marginTop:'50px'}} >
        <div className="col-sm justify-content-end d-flex " style={{ bottom: '20px', right: '20px' }}>
     
           <Button onClick={handleDelete} style={{ background: 'black', color: 'white', border: 'none', padding: '10px', paddingInline: '30px', borderRadius: '25px', marginBottom: '10px', cursor: 'pointer' }} block>
              Delete
           </Button>
        </div>
        <div className="table-responsive">
            <Table striped bordered hover style={{ maxWidth: '100%',zIndex:'2',marginBottom:'100px' }}> 
            <thead>
                <tr>
                    <th></th>
                <th>Invoice ID</th>
                <th>Delivery Date</th>
                <th>Delivery Time</th>
                    <th>Customer Name</th>
                <th>Total</th>
                <th>Advance</th>
                <th>Balance</th>
                    <th>View Bills</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                  <tr key={item.invoice_id}>
                    <td>
                        <input
                         type="checkbox"
                        onChange={e => handleCheckboxChange(e, item.invoice_id)}
                        checked={selectedRows.includes(item.invoice_id)}
                        />
                    </td>
                    <td>{item.invoice_id}</td>
                    <td>{item.delivery_date}</td>
                    <td>{item.delivery_time}</td>
                    <td>{item.Customer_name}</td>
                    <td>{item.total}</td>
                    <td>{item.advance}</td>
                    <td>{item.available_balance}</td>
                    <td>

                      <a href={`./InvoicePage/${item.invoice_id}`}>View</a>

                    </td>
                </tr>
                 ))}
            </tbody>
            </Table>
        </div>
        </div>
      
      {/**------------------------------------------------Button Row--------------------------------------------------------------------------- */}

      <div className="row gx-2">
       

        <div className="col-sm  " style={{ position:'fixed',alignItems:'baseline', bottom: '20px', left: '20px' }}>
            <Button onClick={handleLogout} style={{ background: 'black', color: 'white', border: 'none', padding: '10px', paddingInline: '30px', borderRadius: '25px', marginTop: '10px', cursor: 'pointer'}} block>
              Logout
            </Button>

        </div>
      </div>
<ToastContainer/>
    </div>
      
    
  );
};


export default ViewBills;