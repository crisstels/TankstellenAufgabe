type ErrorProps = {
    message: string;
}

// Component which shows a error message
const ErrorPage = (props: ErrorProps) => {
    return (<div className="flex flex-col gap-3">
        <h1 className="mx-auto text-xl"> Ein Fehler ist aufgetreten</h1>
        <p>{props.message || "Ein unbekannter Fehler ist aufgetreten"}</p>
    </div>)
}

export default ErrorPage;