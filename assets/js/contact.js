const contactForm = []

const getContactForm = () => {

    let name = document.getElementById('contactName').value
    let email = document.getElementById('contactEmail').value
    let phone = document.getElementById('contactPhone').value
    let subject = document.getElementById('contactSubject').value
    let message = document.getElementById('contactMessage').value

    if(name == ''){
        return alert('Harap Masukkan Nama!')
    }else if(email == ''){
        return alert('Harap Masukkan Email!')
    }else if(phone == ''){
        return alert('Harap Masukkan Nomor Telepon Anda!')
    }else if(subject == ''){
        return alert('Harap Pilih Subjek yang Disediakan')
    }else if(message == ''){
        return alert('Pesan Anda Masih Kosong!')
    }

    const a = document.createElement("a");
    a.href = `mailto:acep.awaludin179@gmail.com?subject=${subject}&body=Halo, nama saya adalah ${name}. ${message}.Oleh karena itu, saya tertarik merekrut anda untuk menjadi seorang ${subject} di perusahaan kami. Silakan hubungi kami melalui ${email} atau ${phone}`;
    a.target = '_blank'
    a.click();

    let dataContactForm = {
        name,
        email,
        phone,
        subject,
        message
    }

    contactForm.push(dataContactForm);

console.log(contactForm)

}