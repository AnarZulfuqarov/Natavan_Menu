import './index.scss'
function Title({title,desc}) {
    return (
        <div id={"title"}>
            <h2>{title}</h2>
            <p>{desc}</p>
        </div>
    );
}

export default Title;