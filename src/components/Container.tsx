export default function Container(props: any) {
    return (
        <div className='gifs-container'>
            {props.gifs}
        </div>
    )
}