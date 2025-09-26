import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';


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

export default Dashboard;