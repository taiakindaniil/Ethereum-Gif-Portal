export default function GIFInput(props: any) {
    return (
        <div className='input-container'>
        <input
            type='text'
            placeholder='Paste your GIF URL'
            className='gif-input'
            value={props.value}
            onChange={props.handleChange}
        />
        <button className='post-button' onClick={props.handleClick}>
            Post
        </button>
        </div>
    )
}