import HindariSeks from "../assets/hindariseks.png";
import HindariSeks2 from "../assets/hindariseks2.png";
import InfeksiMenular from "../assets/infeksimenular.png";
import KankerServiks from "../assets/kankerserviks.png";
import Hiv from "../assets/hiv.png";
import Hiv2 from "../assets/hiv2.png";

function BeresikoTinggi() {
  return (
    <div style={{ userSelect: 'none' }}>
        <img src={HindariSeks} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={HindariSeks2} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={InfeksiMenular} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={KankerServiks} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={Hiv} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={Hiv2} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
    </div>
  )
}

export default BeresikoTinggi