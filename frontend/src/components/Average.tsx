type Props = {
  times: number[];
}

function Average({times }: Props) {
  const lastFive = times.slice(0,5);
  const average = lastFive.length > 0 ? (lastFive.reduce((a,b) => a+b, 0) /lastFive.length / 1000).toFixed(3):'N/A';
  return (
    <div>
      <h2>Average of Last 5</h2>
      <p>{average}s</p>
    </div>
  )

}

export default Average;
