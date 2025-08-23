
// Đối tượng
function Validator(options) {

    var selecterRules = {};

         function getParent(element, selector) {
            var isParent = element.closest(selector);
            if (isParent) {
                return isParent;
            }
        }
    // Lấy ra các rules
    function Validate(inputElement, rule) {
        

        
         var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        
         // Lặp qua mỗi rule , rule nào có lỗi trước thì lấy lỗi đó
         var rules =  selecterRules[rule.selector];
         for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    var errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                        )
                    
                    break;
                default:
                    var errorMessage = rules[i](inputElement.value);    

            }
            if(errorMessage)
                break;
         }
            if(errorMessage) {
                // Hiển thị thông báo lỗi   
                errorElement.innerText = errorMessage;
                getParent(inputElement,options.formGroupSelector).classList.add('invalid');
                
            }
            else {
                // Xóa thông báo lỗi
                errorElement.innerText = '';
                getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
            }


            return !errorMessage;
    }
   

        function oninputChange(inputElement) {
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);

        errorElement.innerText = '';
        getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
    
    }

    var formElement = document.querySelector(options.form);


    if(formElement) {

        //Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach (function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                


                Validate(inputElement, rule);
              
                var isValid = Validate(inputElement, rule);
                if (!isValid) {
                   isFormValid = false;
                 }
              
            });
             if (isFormValid) {
                if(typeof options.onsubmit === 'function') {
                    // Lấy ra các input có name và không bị disable
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    // Chuyển đổi NodeList thành mảng và lấy giá trị của các input
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                    
                    switch (input.type) {
                        case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                        case 'checkbox':
                            if(!input.matches(':checked')) return values;
                              if(!Array.isArray(values[input.name])) 
                                    values[input.name] = [];
                               values[input.name].push(input.value); 
                               break;
                        default:
                              values[input.name] = input.value;

                            }
                            
                          

                    
                    return values;

                    },{})
                    // Gọi hàm onsubmit và truyền giá trị của form
                   options.onsubmit(formValues);
                }
                else {
                    // Trường hợp submit mặc định
                    formElement.submit();
                }
            }
                
        }

        options.rules.forEach(function(rule) {

           // Lưu lại các rules cho mỗi input
            if(Array.isArray(selecterRules[rule.selector])) {
                selecterRules[rule.selector].push(rule.test);
            }else {
                selecterRules[rule.selector] = [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            
            Array.from(inputElements).forEach(function(inputElement) {
               inputElement.onblur = function() {
                    Validate(inputElement, rule);
                }
                // Xử lý trường hợp khi người dùng nhập vào ô input
                inputElement.oninput = function() {
                    oninputChange(inputElement);
                }
            });
           
        });
    }

    
}

// Định nghĩa các phương thức của Validator


Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
           
            return value ? undefined : 'Vui lòng nhập trường này';
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email';
        }
    }
}

Validator.isMinLength = function(selector,min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : 'Vui lòng nhập ít nhất 6 ký tự';
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function(value) {
        return value === getConfirmValue() ? undefined : message ;
          
        
    }
  }
}