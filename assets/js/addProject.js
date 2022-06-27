const addProject = () => {
    //. Name & Description
    let name = document.getElementById('projectName').value
    let description = document.getElementById('projectDescription').value
    let startDate = document.getElementById('projectStartDate').value
    let endDate = document.getElementById('projectEndDate').value

    // . Techologies
    let technologies = []
    
    let html = document.getElementById('projectHTML').checked
    if (html){
        html = document.getElementById('projectHTML').value
        technologies.push('oke')
    }
    
    let css = document.getElementById('projectCSS').checked
    if (css){
        css = document.getElementById('projectCSS').value
        technologies.push('oke')
    }
    
    let js = document.getElementById('projectJS').checked
    if (js){
        js = document.getElementById('projectJS').value
        technologies.push('oke')
    }
    
    let tailwind = document.getElementById('projectTailwind').checked
    if (tailwind){
        tailwind = document.getElementById('projectTailwind').value
        technologies.push('oke')
    }
    
    let sass = document.getElementById('projectSASS').checked
    if (sass){
        sass = document.getElementById('projectSASS').value
        technologies.push('oke')
    }
    
    //. Image
    
    image = document.getElementById('projectImage').files
    
    //. Form Validation
    
    if(name == ''){
        return alert('Silakan isi Nama Projek!')
    } else if (startDate == ''){
        return alert('Silakan tentukan tanggal memulai project!')
    } else if (endDate == ''){
        return alert('Silakan tentukan tanggal berakhirnya projek')
    } else if (description == ''){
        return alert('Kolom deskripsi masih kosong!')
    } else if (technologies.length == 0){
        return alert('Silakan pilih salah satu teknologi yang diterapkan!')
    } else if(image.length == 0){
        return alert('Silakan unggah gambar projek anda!')
    } else {
        image = URL.createObjectURL(image[0])
    }

    submitForm()

}

const submitForm = () => {
    
    let form = document.getElementById('formProject')
    form.setAttribute('action', '/add-project')
    form.setAttribute('method', 'POST')
    
    let button = document.getElementById('projectButton')
    button.removeAttribute('onclick')
    button.setAttribute('type', 'submit')
}

    const editProject = (id) => {
        //. Name & Description
        let name = document.getElementById('projectName').value
        let description = document.getElementById('projectDescription').value
        let startDate = document.getElementById('projectStartDate').value
        let endDate = document.getElementById('projectEndDate').value
        
        // . Techologies
        let technologies = []
        
        let html = document.getElementById('projectHTML').checked
        if (html){
            html = document.getElementById('projectHTML').value
            technologies.push('oke')
        }
        
        let css = document.getElementById('projectCSS').checked
        if (css){
            css = document.getElementById('projectCSS').value
            technologies.push('oke')
        }
        
        let js = document.getElementById('projectJS').checked
        if (js){
            js = document.getElementById('projectJS').value
            technologies.push('oke')
        }
        
        let tailwind = document.getElementById('projectTailwind').checked
        if (tailwind){
            tailwind = document.getElementById('projectTailwind').value
            technologies.push('oke')
        }
        
        let sass = document.getElementById('projectSASS').checked
        if (sass){
            sass = document.getElementById('projectSASS').value
            technologies.push('oke')
        }
        
        //. Image
        
        image = document.getElementById('projectImage').files
        
        //. Form Validation
        
        if(name == ''){
            return alert('Silakan isi Nama Projek!')
        } else if (startDate == ''){
            return alert('Silakan tentukan tanggal memulai project!')
        } else if (endDate == ''){
            return alert('Silakan tentukan tanggal berakhirnya projek')
        } else if (description == ''){
            return alert('Kolom deskripsi masih kosong!')
        } else if (technologies.length == 0){
            return alert('Silakan pilih salah satu teknologi yang diterapkan!')
        } else if(image.length == 0){
            return alert('Silakan unggah gambar projek anda!')
        } else {
            image = URL.createObjectURL(image[0])
        }
        
            let form = document.getElementById('formProject')
            form.setAttribute('action', `/edit-project/${id}`)
            form.setAttribute('method', 'POST')
            
            let button = document.getElementById('projectButton')
            button.removeAttribute('onclick')
            button.setAttribute('type', 'submit')

    }
    
    