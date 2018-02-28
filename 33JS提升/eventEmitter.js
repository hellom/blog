class eventEmitter{
	on(event, listener){
		this.eventCollection = this.eventCollection || {};
		this.eventCollection[event] = this.eventCollection[event] || [];
		this.eventCollection[event].push(listener);
		return this;
	}

	addListener(event, listener){
		return this.on(event, listener);
	}

	once(event, listener){
		const fn = () => {
			this.off(event, fn);
			listener.apply(this, arguments);
		}
		fn.listener = listener;
		this.on(event,fn);
		return this;
	}

	off(event, listener){
		let listeners;

		if(!this.eventCollection){
			return this;
		}

		listeners.forEach((fn,i) => {
			if(fn === listener || fn.listener === listener){
				listeners.splice(i,i)
			}
		})

		if(listeners.length === 0){
			delete this.eventCollection[event];
		}

		return this;
	}

	listeners(event){
		return this.eventCollection[event];
	}

	emit(event, ...args) {

        // 指定事件的监听函数数组
        let listeners;

        // 指定的事件的collection不存在，则直接返回实例
        if (!this.eventCollection || !(listeners = this.eventCollection[event])) {
            return this;
        }

        // 克隆监听函数群
        listeners = listeners.slice(0);

        listeners.forEach(fn => fn.apply(this, args));

        return this;
    }


}