const elements = {
    success: document.querySelector('#successBox'),
    error: document.querySelector('#errorBox'),
    loading: document.querySelector('#loadingBox')
}

// elements.success.addEventListener('click', hideSuccess)
// elements.error.addEventListener('click', hideError)
// elements.loading.addEventListener('click', hideLoading)

export async function showSuccess(message) {
    document.querySelector('#successBox').textContent = message;
    document.querySelector('#successBox').style.display = 'block';
    document.querySelector('#successBox').addEventListener('click', ()=>{
        document.querySelector('#successBox').style.display = 'none';
    })
}

let requests = 0;


export function showError(message) {
    document.querySelector('#errorBox').textContent = message;
    document.querySelector('#errorBox').style.display = 'block';
    document.querySelector('#errorBox').addEventListener('click', ()=>{
        document.querySelector('#errorBox').style.display = 'none';
    })
}

export function beginRequest() {
    requests++;
    elements.loading.style.display = 'block';
}

export async function hideSuccess() {
    document.querySelector('#successBox').style.display = 'none';
}

// export function hideError() {
//     elements.error.style.display = 'none';
// }

export function endRequest() {
    requests--;
    if(requests === 0){
        elements.loading.style.display = 'none';
    }
}