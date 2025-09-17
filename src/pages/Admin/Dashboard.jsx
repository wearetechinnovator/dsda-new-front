import Nav from '../../components/Admin/Nav'
import SideNav from '../../components/Admin/SideNav';
// import MyBreadCrumb from '../components/BreadCrumb';


const Dashboard = () => {
  return (
    <>
      <Nav title={"Dashboard"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          hello world
        </div>
      </main>
    </>
  )
}

export default Dashboard