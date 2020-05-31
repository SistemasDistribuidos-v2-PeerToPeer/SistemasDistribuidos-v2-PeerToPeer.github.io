// UI Manager for the Chat app
function myjsapp(peerClient) {
    var chatHistory = {};
    var chatMobile = {};
    var chatPanel = {};

    var cookie = {
        // Read cookie
        get : function getCookie (name) {
            var cookies = {};
            var c = document.cookie.split('; ');
            for (i = c.length - 1; i >= 0; i--) {
                var C = c[i].split('=');
                cookies[C[0]] = C[1];
            }
            return cookies[name] || null;
        },

        // create cookie
        set : function createCookie (name, value, minutes) {
            if (minutes) {
                var date = new Date();
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            } else
                var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        },

        remove : function deleteCookie (name) {
            var date = new Date();
            date.setTime(date.getTime() - 60 * 1000);
            document.cookie = name + "=; expires=" + date.toGMTString() + "; path=/";
        }
    };

    function EventListeners() {
        $('#peer-id').tooltip()

        function connectToPeer() {
            var id = $('#inputPeerUserId').val().trim();
            if(id==''){
                var id = $('#inputPeerUserIdMmobile').val().trim();
            }

            if(id) {
                peerClient.connectToId(id.toLowerCase())
                $('#inputPeerUserId').val('')
            }
        }
        $('#connect-btn').click(function (event) {
            connectToPeer()
        });

        $('#connect-btn-mobile').click(function (event) {
            connectToPeer()
        });

        $('#inputPeerUserId').keypress(function(event) {
            if (13 == event.which) {
                connectToPeer()
            }
        });

        $('#inputPeerUserIdMmobile').keypress(function(event) {
            if (13 == event.which) {
                connectToPeer()
            }
        });

        

        $(document).on('click', '.peeruser', function() {
            var id = $(this).text()
            $('#inputPeerUserId').val(id)
            connectToPeer()
        });

        Element.prototype.remove = function() {
            this.parentElement.removeChild(this);
        }

        $('#peer-id').click(function (event) {
            var textArea = document.createElement("textarea");
            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';
            textArea.value = $(this).text();
            document.body.appendChild(textArea);
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                // console.log('Copying text command was ' + msg);
                textArea.remove();
            } catch (err) {
                // console.log('Oops, unable to copy');
            }
        });

        $('.end-call').click(function (event) {
            // clear CSS for mute buttons
            $('.mute-audio, .mute-video').removeClass('btn-success').addClass('btn-secondary')
            // End established call
            peerClient.endCall();
        })

        $('#user-name').keypress(function (event) {
            if (13 == event.which) {
                var username = $('#user-name').val().trim();
                $('#getUserNameModal').modal('hide')
                if(cookie.get('username') != username)
                    startPeerClient(username)
            }
        })

        $('.username-done').click(function (event) {
            var username = $('#user-name').val().trim();
            if(cookie.get('username') != username)
                startPeerClient(username)
        })

        


        // $('.reject-call').click(function (event) {
        //     // End established call
        //     peerClient.rejectIncomingCall();
        // })

        // $('.mute-audio').click(function (event) {
        //     if($(this).hasClass('btn-secondary')) {
        //         $(this).removeClass('btn-secondary').addClass('btn-success')
        //         // End established call
        //         peerClient.muteAudio(false);
        //     } else {
        //         $(this).removeClass('btn-success').addClass('btn-secondary')
        //         peerClient.muteAudio(true);
        //     }
        // })
        // $('.mute-video').click(function (event) {
        //     if($(this).hasClass('btn-secondary')) {
        //         $(this).removeClass('btn-secondary').addClass('btn-success')
        //         // End established call
        //         peerClient.muteVideo(false);
        //     } else {
        //         $(this).removeClass('btn-success').addClass('btn-secondary')
        //         peerClient.muteVideo(true);
        //     }
        // })
    }

    function appendToHistory(id, message, isSent) {

        if(chatHistory[id]) {
            var hist = chatHistory[id];
            var histMobile = chatMobile[id];
            


            if(isSent){
                var msg=$('<div class="container mt-3"><div class="row flex-row-reverse"><div class="enviado"><div> '+ message+'</div><div class="d-flex flex-row-reverse"><div class="triangulo-enviado"></div></div></div></div></div>');   
                var msgmobile=$('<div class="container mt-3"><div class="row flex-row-reverse"><div class="enviado"><div> '+ message+'</div><div class="d-flex flex-row-reverse"><div class="triangulo-enviado"></div></div></div></div></div>');
            }
            else{
                var msg=$('<div class="container mt-3"><div class="row"><div class="recebido"><div> '+ message+'</div><div class="triangulo-para-baixo"></div></div></div></div>');
                var msgmobile=$('<div class="container mt-3"><div class="row"><div class="recebido"><div> '+ message+'</div><div class="triangulo-para-baixo"></div></div></div></div>');
                
                // if($('#'+id).hasClass("d-none")==true){
                //     $('.chamadaModal').text(id+' ')
                //     $("#getchamada").modal({
                //         show: true
                //       });
                // }

            }
            histMobile.append(msgmobile)
            .scrollTop(histMobile[0].scrollHeight); 
            hist.append(msg)
                .scrollTop(hist[0].scrollHeight);   
        }
    }

    function startPeerClient(username) {
        // TODO - Set title
        cookie.set('username', username);
        peerClient.connectToServerWithId(username);
    }

    // Show Username Modal
    var username = cookie.get('username');
    if(username) {
        $('#user-name').val(username)
        startPeerClient(username)
    } else {
        $('#getUserNameModal').modal('show')
    }

    EventListeners();        

    return {
        setPeerId : function (id) {
            $('#peer-id').text(id);
            $('#peer-id-mobile').text(id);
        },

        createChatWindow: function(id) {
            
            var idUser = id;
            //Cria lista de usuarios conectados no menu mobile
            var listChamadas = $('.conversas')
            var usr = '<li class="nav-item" id="'+idUser+'-conversas"><a class="nav-link conversas-chat ml-5"  onclick="navegarChat('+idUser+')" >'+idUser+'</a></li>'
            listChamadas.append(usr);

            
            
            var panelMobile = $(
                '<div class="chat-box-mobile h-100 d-none" id="'+idUser+'">'+
                    '<div class="panel-body-mobile">'+

                    '</div> '+

                    '<div class="panel-footer-mobile">'+
                        '<div class="form-group d-flex m-2">'+
                        '</div>'+
                    '</div>'+
                '</div>'


            )

            var historyMobile =  $('<ul class="chatHistory-mobile"></ul>');
            var messageMobile = $('<input type="text" class="form-control" placeholder="Mensagem">')
            var sendBtnMobile = $('<button type="button" class="ml-2 btn btn-enviar">Enviar</button>')
            chatMobile[idUser] = historyMobile

            $('.panel-body-mobile', panelMobile).append(historyMobile)
            $('.form-group', panelMobile).append(messageMobile).append(sendBtnMobile)
            $('.chat-mobile').append(panelMobile);
            
            var altura = $('.chat-mobile').height();
            historyMobile.height(altura-56);

            messageMobile.keypress(function(event) {
                if (13 == event.which) {
                    var msgText = $(this).val().trim()
                    if(msgText) {
                        peerClient.sendMessage(idUser, msgText)
                        appendToHistory(idUser, msgText, true)
                        $(this).val('')
                    }
                }
            });

            sendBtnMobile.click(function(event) {
                var msgText = messageMobile.val().trim()
                if(msgText) {
                    peerClient.sendMessage(idUser, msgText)
                    appendToHistory(idUser, msgText, true)
                    messageMobile.val('').focus()
                }
            });
            
            
            
            //-------------------------------------------------------------
            var toPeerId = id;
            var panel = $(
                '<div class="chat-box"><div class="panel-titulo"></div>' +
                '<div class="panel-body"></div><div class="panel-footer">' +
                '<div class="form-inline"><div class="form-group">' +
                '</div></div></div></div>')

            var title = $('<span class="panel-title"></span>').text(toPeerId)
            var history = $('<ul class="chatHistory"></ul>')
            var message = $('<input type="text" class="form-control" placeholder="Mensagem">')
            var sendBtn = $('<button type="button" class="ml-2 btn btn-enviar">Enviar</button>')
            var chatButton = $('<a class="portfolio-link">');
            var finishChat = $(' <img src="img/close.png" class="float-right mr-2" alt="fechar" style="width: 18px;"></a>');
            chatButton.append(finishChat)
            chatHistory[toPeerId] = history
            chatPanel[toPeerId] = panel

            $('.panel-titulo', panel).append(title).append(chatButton)
            $('.panel-body', panel).append(' <div class="text-center"><span class="descricao-chat ">Diga um "oi" para seu parceiro</span></div> ').append(history)
            $('.form-group', panel).append(message).append(sendBtn)

            $('.chat-container > div').append(panel);

            
            $('.panel-titulo', panel).click(function () {
                var box = $(".chat-box");
                var panelBody = $(".panel-body, .panel-footer", $(this).parent());
                if(panelBody.hasClass("d-none")) {
                    panelBody.removeClass("d-none")
                    box.removeClass("d-table")
                } else {
                    panelBody.addClass("d-none")
                    box.addClass("d-table")
                }                
            })

            message.keypress(function(event) {
                if (13 == event.which) {
                    var msgText = $(this).val().trim()
                    if(msgText) {
                        peerClient.sendMessage(toPeerId, msgText)
                        appendToHistory(toPeerId, msgText, true)
                        $(this).val('')
                    }
                }
            });

            sendBtn.click(function(event) {
                var msgText = message.val().trim()
                if(msgText) {
                    peerClient.sendMessage(toPeerId, msgText)
                    appendToHistory(toPeerId, msgText, true)
                    message.val('').focus()
                }
            });
            finishChat.click(function (event) {
                // console.log(toPeerId);
                peerClient.close(toPeerId);
                // closeChatWindow(toPeerId);
                // initializeLocalVideo()
                // var isVideoCall = false;
                // peerClient.makeCall(toPeerId, isVideoCall);
                // return false
            })
        },

        appendHistory : appendToHistory,

        closeChatWindow : function (id) {
            if(chatPanel[id]) {
                chatPanel[id].remove()
                delete chatPanel[id]
                delete chatHistory[id]
                delete chatHistory[id+'mob']
            }
        },
       
        showError : function (msg) {
            
        },
        updateOnlieUsers : function (users) {
            var list = $('.onlinepeers')
            list.empty()
            if(users.length == 0) {
                var usr = '<li>Usuarios online</li>'
                list.append(usr);
                return
            }
            for (var i = 0; i < users.length; i++) {
                var usr = '<li class="peeruser">'+ users[i] + '</li>'
                list.append(usr);
            }
        }
    };
}

var myapp, peerapp;

$(document).ready(function () {
    myapp = myjsapp(peerapp);
});


function navegarChat(html){
    console.log($('#'+html.id+'-conversas'))
    $('.selecionado').removeClass("selecionado")
    $('#'+html.id+'-conversas').addClass("selecionado")

    $('.chat-box-mobile').addClass("d-none");
    $('.usuario-mobile').text('  '+html.id)
    $('#'+html.id).removeClass("d-none")
    
   

    
}