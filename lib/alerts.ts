import Swal from "sweetalert2";

export function showWarningAlert(
  message: string,
  actionUrl?: string,
  actionText?: string,
) {
  if (actionUrl) {
    Swal.fire({
      icon: "warning",
      title: "মনোযোগ দিন",
      text: message,
      confirmButtonText: actionText || "লগ ইন করুন",
      confirmButtonColor: "#059669",
      showCancelButton: true,
      cancelButtonText: "বন্ধ করুন",
      cancelButtonColor: "#78716c",
      customClass: {
        popup: "rounded-2xl font-sans",
        confirmButton: "cursor-pointer rounded-lg px-4 py-2 font-bold",
        cancelButton: "cursor-pointer rounded-lg px-4 py-2 font-bold",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = actionUrl;
      }
    });
  } else {
    Swal.fire({
      icon: "warning",
      title: "মনোযোগ দিন",
      text: message,
      confirmButtonText: "ঠিক আছে",
      confirmButtonColor: "#059669",
      customClass: {
        popup: "rounded-2xl font-sans",
        confirmButton: "cursor-pointer rounded-lg px-4 py-2 font-bold",
      },
    });
  }
}

export function showErrorAlert(message: string, title: string = "ত্রুটি") {
  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "ঠিক আছে",
    confirmButtonColor: "#059669",
    customClass: {
      popup: "rounded-2xl font-sans",
      confirmButton: "cursor-pointer rounded-lg px-4 py-2 font-bold",
    },
  });
}

export function showSuccessAlert(title: string, message?: string) {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonText: "ঠিক আছে",
    confirmButtonColor: "#059669",
    customClass: {
      popup: "rounded-2xl font-sans",
      confirmButton: "cursor-pointer rounded-lg px-4 py-2 font-bold",
    },
  });
}
