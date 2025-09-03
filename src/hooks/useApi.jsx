import Cookies from 'js-cookie';
import useMyToaster from './useMyToaster';

const useApi = () => {
  const toast = useMyToaster();

  const deleteData = async (ids, model, trash = false) => {
    console.log(ids);
    const url = process.env.REACT_APP_MASTER_API + `/${model}/delete`;
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ ids: ids, trash })
    });

    const res = await req.json();
    if (req.status !== 200) {
      return toast(res.err, 'error')
    }
    window.location.reload();
    return toast("Record delete successfully", 'success');
  }


  return { deleteData };
}

export default useApi;