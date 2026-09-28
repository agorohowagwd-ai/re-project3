export default function HouseVisual({ variant = 'north' }: { variant?: string }) {
  return (
    <div className={`houseVisual ${variant}`} aria-hidden="true">
      <div className="houseSky" />
      <div className="houseGround" />
      <div className="houseBody">
        <div className="houseRoof" />
        <div className="houseWindow w1" />
        <div className="houseWindow w2" />
        <div className="houseWindow w3" />
        <div className="houseDoor" />
        <div className="houseVolume" />
      </div>
      <div className="houseLabel">RE:PROJECT / ARCHITECTURE</div>
    </div>
  );
}
